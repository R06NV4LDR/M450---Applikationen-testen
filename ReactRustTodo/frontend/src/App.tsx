import { useEffect, useState } from "react";
import Todos from "./components/Todos";
import BoxComponent from "./providers/BoxProvider";

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.message) {
          setStatus(data.message);
        } else {
          console.error("Response data was not as expected:", data);
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, []); // This empty array causes this effect to only run once, when the component mounts.

  return (
    <>
      {status === "Everything is working fine" ? (
        // center main content
        <div className="flex justify-center h-100% ">
          <BoxComponent>
            <h1 className="text-xl">Todo with a Rust Backend!</h1>
            <h1 className="text-2xl pt-3 text-green-600">Todos:</h1>
            <Todos />
          
          </BoxComponent>
        </div>
      ) : (
        <h1>Error wihthin the API</h1>
      )}
    </>
  );
}

export default App;