import {React} from 'react';
const InsightsPoster = ({ insights }) => {
  

  return (
    <div className="insights-poster">
       <h2>Insights:</h2>
          <ul>
            {Object.keys(insights).map((key) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(insights[key], undefined, 2)}
              </li>
            ))}
          </ul>
    </div>
  );
};

export default InsightsPoster;
