const getData = async () => {
  const fetchRequest = await fetch(
    "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json"
  );
  const data = await fetchRequest.json();
  //console.log(data);
  return data;
};

const getMCC = async () => {
  const data = await convertArray();
  let TP = 0,
    TN = 0,
    FP = 0,
    FN = 0;
  data.forEach((ele) => {
    if (ele.squirrel && ele.pizza) {
      TP++;
    }
    if (ele.squirrel && !ele.pizza) {
      FP++;
    }
    if (!ele.squirrel && ele.pizza) {
      FN++;
    }
    if (!ele.squirrel && !ele.pizza) {
      TN++;
    }
  });

  return (
    (TP * TN - FP * FN) /
    Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN))
  );
};

const obj = {
  squirrel: false,
  pizza: false,
};

const convertArray = async () => {
  const dataSet = await getData();
  let array = [];

  dataSet.forEach((ele) => {
    const obj = {
      squirrel: ele.squirrel,
      pizza: ele.events.includes("pizza"),
    };
    array.push(obj);
  });
  return array;
};

console.log(convertArray());

getMCC();

const createTable = async () => {
  const tableBody = document.querySelector(".table-body");
  console.log(tableBody);
  const data = await getData();

  data.forEach((ele, index) => {
    console.log(ele);
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr class="${ele.squirrel ? "table-danger" : ""}"><th scope="row">${
        index + 1
      }</th><td>${ele.events.join(", ")}</td><td>${ele.squirrel}</td></tr>`
    );
  });
};

createTable();
