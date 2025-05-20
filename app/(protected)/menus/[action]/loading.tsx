import Image from "next/image";

export default function LoadingCategories() {
  return (
    <div className="flex items-center justify-center py-20">
      <Image src={"/loader.gif"} alt="Loading" width={200} height={200} />
    </div>
  );
}
