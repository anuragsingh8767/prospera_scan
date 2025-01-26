export const fetchConnectionsForConnectors = async (token) => {
  try {
    // Fetch all connectors
    const connectorsResponse = await fetch('http://localhost:5000/v1/connectors/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!connectorsResponse.ok) throw new Error('Failed to fetch connectors');

    const connectors = await connectorsResponse.json();

    // Fetch connections for each connector
    const connectionsData = await Promise.all(
      connectors.map(async (connector) => {
        const connectionResponse = await fetch('http://localhost:5000/v1/connection/list', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type_id: connector.type_id }),
        });

        const connectionData = await connectionResponse.json();

        // If no connections found for this type, return empty array
        if (connectionData.length === 0) {
          console.error(`No connections found for type_id: ${connector.type_id}`);
          return [];
        }

        // Return connections with connector and connection details
        return connectionData.map((connection) => ({
          connector_id: connector._id, // Connector ID
          type: connector.type,        // Connector Type
          connection_id: connection._id, // Connection Type ID (_id from /connection/list)
          name: connection.name,
          status: 'Loading',           // Placeholder status
        }));
      })
    );

    // Flatten the array of arrays into a single array
    return connectionsData.flat();

  } catch (error) {
    console.error('Error fetching connections:', error);
    return [];
  }
};
