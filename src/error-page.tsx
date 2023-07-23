import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();
  //   console.log(error);
  return (
    <div
      id="error-page"
      className="h-screen w-screen flex justify-center items-center flex-col"
    >
      <h1 className="text-2xl">Oops!</h1>
      <p className="text-xl">
        <i>{error.status}</i> <br />
        <i>{error.data}</i>
      </p>
    </div>
  );
}
