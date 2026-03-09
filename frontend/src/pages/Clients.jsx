import React, { useState } from "react";
import ClientsListView from "../components/Client/ClientView";
import ClientMaster from "../components/Client/ClientForm";

const Clients = () => {
  const [isListView, setIsListView] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <>
      {isListView ? (
        <ClientsListView
          setIsListView={setIsListView}
          setSelectedClient={setSelectedClient}
        />
      ) : (
        <ClientMaster
          setIsListView={setIsListView}
          selectedClient={selectedClient}
        />
      )}
    </>
  );
};

export default Clients;