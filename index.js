const getData = async () => {
  const fetchRequest = await fetch(
    "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json"
  );
  const data = await fetchRequest.json();
  return data;
};

const getMCC = (dataSet, event) => {
  const data = convertArray(dataSet, event);
  let TP = 0,
    TN = 0,
    FP = 0,
    FN = 0;
  data.forEach((ele) => {
    if (ele.squirrel && ele.event) {
      TP++;
    }
    if (ele.squirrel && !ele.event) {
      FP++;
    }
    if (!ele.squirrel && ele.event) {
      FN++;
    }
    if (!ele.squirrel && !ele.event) {
      TN++;
    }
  });

  return (
    (TP * TN - FP * FN) /
    Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN))
  );
};

const convertArray = (dataSet, event) => {
  return dataSet.map((ele) => {
    return {
      squirrel: ele.squirrel,
      event: ele.events.includes(event),
    };
  });
};

const createEventTable = async () => {
  const tableBody = document.querySelector(".table-body");
  const data = await getData();

  data.forEach((ele, index) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr class="${ele.squirrel ? "table-danger" : ""}"><th scope="row">${
        index + 1
      }</th><td>${ele.events.join(", ")}</td><td>${ele.squirrel}</td></tr>`
    );
  });
};

const createCorrelationTable = async () => {
  const tableBody = document.querySelector(".correlation-table-body");
  const data = await getData();

  let array = data.flatMap((ele) => ele.events);
  array = Array.from(new Set(array));

  let resArray = array.map((ele) => {
    return {
      event: ele,
      correlation: getMCC(data, ele),
    };
  });

  resArray.sort((a, b) => {
    return a.correlation < b.correlation;
  });

  resArray.forEach((ele, index) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr><th scope="row">${index + 1}</th><td>${ele.event}</td><td>${
        ele.correlation
      }</td></tr>`
    );
  });
};

createEventTable();
createCorrelationTable();
