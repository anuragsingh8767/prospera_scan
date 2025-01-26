import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Checkbox } from 'primereact/checkbox';
import { fetchConnectionsForConnectors } from './fetchConnectors'; 

const TestConnectionTable = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingAll, setTestingAll] = useState(false);
  const [selectedConnections, setSelectedConnections] = useState([]);

  const fetchData = async () => {
    const token = sessionStorage.getItem('authToken');
    console.log('Fetching connections...');

    try {
      // Fetch connection data
      const connectionsData = await fetchConnectionsForConnectors(token);

      // Set initial status to an empty string
      const connectionsWithEmptyStatus = connectionsData.map((connection) => ({
        ...connection,
        status: '',
      }));

      setConnections(connectionsWithEmptyStatus);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTestAllConnections = useCallback(async () => {
    if (selectedConnections.length === 0) {
      console.log('No connections selected.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    setTestingAll(true);

    // Set status to 'Loading' to show the spinner for each selected connection being tested
    const connectionsLoading = connections.map(connection => 
      selectedConnections.includes(connection.connection_id) ? { ...connection, status: 'Loading' } : connection
    );
    setConnections(connectionsLoading);

    try {
      const updatedConnections = await Promise.all(
        connectionsLoading.map(async (connection) => {
          if (!selectedConnections.includes(connection.connection_id)) return connection;

          const testResponse = await fetch('http://localhost:5000/v1/connection/test', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: connection.name, type: connection.type }),
          });

          const testResult = await testResponse.json();
          return {
            ...connection,
            status: testResult.isOperational ? 'Success' : 'Failure',
          };
        })
      );

      setConnections(updatedConnections);
    } catch (error) {
      console.error('Error testing connections:', error);
    } finally {
      setTestingAll(false);
      setSelectedConnections([]); // Clear selection after testing
    }
  }, [connections, selectedConnections]);

  const statusBody = (rowData) => {
    if (rowData.status === 'Loading') {
      return <ProgressSpinner style={{ width: '25px', height: '25px' }} strokeWidth="5" fill="var(--surface-ground)" animationDuration="2s" />;
    } else if (rowData.status) {
      return rowData.status;
    }
    return null; // Show nothing if the status is empty
  };

  const onCheckboxChange = (e, connection) => {
    const selected = [...selectedConnections];
    if (e.checked) {
      selected.push(connection.connection_id); // Using _id from /connection/list
    } else {
      const index = selected.indexOf(connection.connection_id);
      selected.splice(index, 1);
    }
    setSelectedConnections(selected);
  };

  const checkboxBody = (rowData) => {
    return (
      <Checkbox
        onChange={(e) => onCheckboxChange(e, rowData)}
        checked={selectedConnections.includes(rowData.connection_id)}
      />
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Data Sources</h2>
        <Button
          label="Test Connections"
          icon="pi pi-check"
          className="p-button-primary"
          onClick={handleTestAllConnections}
          disabled={testingAll}
        />
      </div>
      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <p>Loading connections...</p>
        ) : (
          <DataTable value={connections} scrollable scrollHeight="570px">
            <Column body={checkboxBody} style={{ width: '5%' }} />
            <Column field="connector_id" header="Connection Type Id" style={{ width: '25%' }}/>
            <Column field="connection_id" header="Connector Id" style={{ width: '25%' }}/>
            <Column field="name" header="Connection Name" style={{ width: '20%' }}/>
            <Column field="type" header="Type" style={{ width: '10%' }}/>
            <Column body={statusBody} header="Status" style={{ width: '20%' }}/>
          </DataTable>
        )}
      </div>
      {testingAll && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="5" fill="var(--surface-ground)" animationDuration="2s" />
        </div>
      )}
    </div>
  );
};

export default TestConnectionTable;
