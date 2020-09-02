import React, { useState, useEffect } from "react";
import "./css/app.css";
import BAREME from "./data/bareme";

const inputValidator = (e) => {
  return e.target.value === ""
    ? true
    : e.target.value >= 0 && e.target.value < Number.POSITIVE_INFINITY
    ? true
    : false;
};

export default function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [sum, setSum] = useState(0);
  const [params, setParams] = useState({
    income: 0,
    nbChilds: 0,
    engaged: false,
  });
  const [tranches, setTranches] = useState([
    { tranche: "", range: "", income: "" },
  ]);
  const handleChange = (e, field) => {
    field !== "engaged"
      ? inputValidator(e)
        ? field === "income"
          ? setParams({ ...params, income: JSON.parse(e.target.value * 1) })
          : setParams({ ...params, nbChilds: JSON.parse(e.target.value) })
        : setParams(params)
      : setParams({ ...params, engaged: JSON.parse(e.target.value) });
  };

  useEffect(() => {
    const calcule = () => {
      const { income, nbChilds, engaged } = params;
      let qF = engaged ? 2 : 1;
      qF = nbChilds <= 2 ? qF + nbChilds * 0.5 : qF + nbChilds - 1;
      let cIncome = (income / qF).toFixed(2);
      let calcTranches = [];
      let sum = 0;
      BAREME.map((range) => {
        if (cIncome >= range.min) {
          let tranche = (cIncome - range.min) * range.taux;
          sum += tranche;
          cIncome = range.min;
          calcTranches = [
            {
              tranche: tranche.toFixed(2),
              range: range,
              income: (income / qF).toFixed(2),
            },
            ...calcTranches,
          ];
        }
        return null;
      });
      setTranches(calcTranches);
      setSum(sum * qF);
    };
    calcule();
  }, [params]);
  return (
    <>
      <h1>
        Calcul de l'impôt sur le revenu à partir du barème applicable aux
        revenus 2020
      </h1>
      <div className="container">
        <form action="">
          <div className="input__control">
            <label htmlFor="">Revenu annuel net</label>
            <span className="mini__container">
              <input
                type="text"
                value={params.income}
                onChange={(e) => handleChange(e, "income")}
              />{" "}
              €
            </span>
          </div>
          <div className="input__control">
            <label htmlFor="">Etat civil</label>
            <span className="mini__container">
              <select
                name=""
                id=""
                onChange={(e) => handleChange(e, "engaged")}
              >
                <option value="false">Celibataire</option>
                <option value="true">En couple</option>
              </select>
            </span>
          </div>
          <div className="input__control">
            <label htmlFor="">Nombre d'enfants</label>

            <span className="mini__container">
              <input
                type="number"
                value={params.nbChilds}
                onChange={(e) => handleChange(e, "nbChilds")}
              />
            </span>
          </div>
        </form>
        <div className="input__control">
          <p> L’impôt sur les revenus :</p>
          <span className="mini__container">{sum.toFixed(2)} €</span>
        </div>
        <div className="input__control">
          <p> Revenus apres impot :</p>
          <span className="mini__container">
            {params.income - sum.toFixed(2)} €
          </span>
        </div>
        <div
          className={showDetails ? "input__control selected" : "input__control"}
          style={{ cursor: "pointer" }}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <p>
              {" "}
              <strong>-</strong> Moins de details{" "}
            </p>
          ) : (
            <p>
              {" "}
              <strong>+</strong> Plus de details{" "}
            </p>
          )}
        </div>

        {showDetails && (
          <ul>
            {tranches.map((tranche) => {
              let bound =
                tranche.range.max < tranche.income
                  ? tranche.range.max
                  : tranche.income;
              return (
                JSON.parse(tranche.income) !== 0 && (
                  <li className="results">
                    <h4>Tranche de revenu de {tranche.range.min} € à {bound} € :</h4>{" "}
                     <p>soit {" "}
                    {(bound - tranche.range.min).toFixed(2)} € imposée à {" "}
                    {tranche.range.taux * 100}% <br/>
                    {(bound - tranche.range.min).toFixed(2)} € x
                    {tranche.range.taux * 100} %</p> <strong>{tranche.tranche} €</strong> 
                  </li>
                )
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
