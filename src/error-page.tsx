import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  //   console.log(error);
  return (
    <div
      id="error-page"
      className="flex h-screen w-screen flex-col items-center justify-center"
    >
      <h1 className="text-2xl text-red-600">Oops!</h1>
      <p className="text-xl">
        <i>{error.status}</i> <br />
        <i>{error.data}</i>
      </p>
    </div>
  );
}
