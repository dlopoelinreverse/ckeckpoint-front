import { useGetCountriesQuery } from "@/graphql/generated/schema";
import Link from "next/link";
import React from "react";

export default function Countries() {
  const { data, loading, error } = useGetCountriesQuery();

  if (loading) return <p>Nous recherchons les pays...</p>;

  return (
    <ul className="flex mx-auto gap-4 flex-wrap items-center justify-center mb-10">
      {data?.countries.map((country) => (
        <Link
          key={country.id}
          href={`/country/${country.code}`}
          className="p-4 border border-gray-200 rounded-md shadow-md flex flex-col items-center justify-center w-28"
        >
          <h2>{country.name}</h2>
          <p>{country.emoji}</p>
        </Link>
      ))}
    </ul>
  );
}
