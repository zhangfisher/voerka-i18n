
import Server from "./server";
import Client from "./client"; 


export default function Index() {
  return (
    <>
    <div className="flex flex-row items-center justify-center gap-4 p-8 mt-18 ">       
          <Server />
          <Client />
    </div>
    </>
  );
}
