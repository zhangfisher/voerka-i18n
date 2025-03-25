import Client from "~/components/client"; 
import Server from "~/components/server.server";  

export default function Home() {
  return ( 
    <main class="text-center mx-auto text-gray-700 p-4 flex flex-row justify-center items-center gap-4">
       <Client/>
       <Server/>
    </main> 
  );
}
