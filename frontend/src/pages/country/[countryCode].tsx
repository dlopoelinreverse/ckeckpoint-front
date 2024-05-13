import { useCountryByCodeQuery } from "@/graphql/generated/schema";
import { useRouter } from "next/router";
import React from "react";

export default function CountryDetails() {
  const router = useRouter();
  const { countryCode } = router.query;

  const { data, loading, error } = useCountryByCodeQuery({
    variables: {
      code: countryCode as string,
    },
  });

  if (loading)
    return (
      <div className="w-screen  flex flex-col mt-10 items-center gap-10">
        <p>Chargement...</p>
      </div>
    );

  if (error) return <p>Erreur: {error.message}</p>;

  return (
    <div className="w-screen  flex flex-col mt-10 items-center gap-10">
      <p className="text-4xl">{data?.country.emoji}</p>
      <div className="flex flex-col justify-center items-center gap-3">
        <p>
          Name : {data?.country?.name} ({data?.country.code})
        </p>
        {data?.country.continent && (
          <p>Continent : {data?.country.continent?.name}</p>
        )}
      </div>
    </div>
  );
}
