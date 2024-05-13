import Countries from "@/components/Countries";
import CountryForm from "@/components/CountryForm";

export default function Home() {
  return (
    <div className="w-screen px-10  flex flex-col gap-5 mt-10 items-center">
      <CountryForm />
      <Countries />
    </div>
  );
}
