interface Contents {
  name: string;
  createdDate: string;
  product: string;
  sharedWithEmail: string;
}

export default function Card({ name, createdDate, product, sharedWithEmail }: Contents) {
  return (
    <div className="flex flex-col items-start justify-center w-[300px] h-[150px] bg-twitter-blue rounded-lg border-[0.7px] border-[#eee] p-4 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.1),_0_2px_6px_-2px_rgba(0,0,0,0.2)]">
      <h1 className="font-bold">{name}</h1>
      <time className="text-sm">{createdDate}</time>
      <p>{product}</p>
      <p>{sharedWithEmail}</p>
    </div>
  );
}
