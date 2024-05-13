import {
  GetCountriesDocument,
  useAddCountryMutation,
  useGetContinentsQuery,
} from "@/graphql/generated/schema";
import React, { useState } from "react";

type FormErrors = {
  name?: string;
  emoji?: string;
  code?: string;
  continent?: string;
};

const checkFormErrors = (formJSON: any) => {
  const errors: FormErrors = {};

  if (!formJSON.name) {
    errors.name = "Veuillez saisir un nom";
  }

  if (!formJSON.emoji) {
    errors.emoji = "Veuillez saisir un emoji";
  }

  if (!formJSON.code) {
    errors.code = "Veuillez saisir un code";
  }

  if (!formJSON.continent) {
    errors.continent = "Veuillez choisir un continent";
  }

  return errors;
};

export default function CountryForm() {
  const [addCountry] = useAddCountryMutation();
  const [mutationError, setMutationError] = useState(false);
  const [inputErrors, setInputErrors] = useState<FormErrors>({});
  const [contientSelected, setContinentSelected] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const formJSON: any = Object.fromEntries(data.entries());

    if (contientSelected !== "") {
      formJSON.continent = {
        id: parseInt(contientSelected),
      };
    }

    const errors = checkFormErrors(formJSON);
    setInputErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    addCountry({
      variables: { data: formJSON },
      refetchQueries: [{ query: GetCountriesDocument }],
      awaitRefetchQueries: true,
    })
      .then(() => setMutationError(false))
      .catch((err) => (console.log(err.message), setMutationError(true)));
  };

  const clearError = (id: string) => {
    setInputErrors((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <form
      className="w-full  p-5 bg-gray-100 border border-slate-400 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row md:justify-between flex-wrap items-center w-full gap-5">
        <Input
          label="Nom"
          id="name"
          error={inputErrors.name}
          onChange={() => clearError("name")}
        />
        <Input
          label="Emoji"
          id="emoji"
          error={inputErrors.emoji}
          onChange={() => clearError("emoji")}
        />
        <Input
          label="Code"
          id="code"
          error={inputErrors.code}
          onChange={() => clearError("code")}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-5 mt-5">
        <ContinentSelect
          onSelect={(contientID) => (
            setContinentSelected(contientID), clearError("continent")
          )}
          continentSelected={contientSelected}
        />
        {inputErrors.continent && (
          <p className="text-orange-400">⚠ {inputErrors.continent}</p>
        )}
        <button
          type="submit"
          className="p-5 h-14 bg-gray-200 flex items-center justify-center rounded-lg"
        >
          Ajouter
        </button>
      </div>
      {mutationError && (
        <p className="w-full text-center text-orange-400 mt-5">
          Une erreur s'est produite 😶
        </p>
      )}
    </form>
  );
}

const Input = ({
  label,
  id,
  error,
  onChange,
}: {
  label: string;
  id: string;
  error?: string;
  onChange: () => void;
}) => (
  <div className={`flex flex-col gap-2 w-full md:w-auto`}>
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      className="p-1 rounded-lg"
      onChange={onChange}
    />
    {error && <p className="text-orange-400">⚠ {error}</p>}
  </div>
);

const ContinentSelect = ({
  onSelect,
  continentSelected,
}: {
  onSelect: (continentID: string) => void;
  continentSelected: string;
}) => {
  const { data, loading, error } = useGetContinentsQuery();

  let placeholder = "";

  if (loading) placeholder = "Chargement...";

  if (error || !data) return null;

  placeholder = "Choisir un continent";

  return (
    <select
      value={continentSelected}
      onChange={(e) => onSelect(e.target.value)}
      className="p-1.5 rounded-lg w-full md:w-auto"
    >
      <option value="">{placeholder}</option>
      {data?.continents.map((continent) => (
        <option key={continent.id} value={continent.id}>
          {continent.name}
        </option>
      ))}
    </select>
  );
};
