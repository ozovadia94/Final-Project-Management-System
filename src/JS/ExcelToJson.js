import "../App.css";
import * as XLSX from "xlsx";

var file=''
var results;

var filePathset = (e) => {
  e.stopPropagation();
  e.preventDefault();
  file = e.target.files[0];
}

var readFile = async () => {
  console.log('asd')
  if (file !== '') {
    var f = file;
    console.log(f)
    // var name = f.name;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      results=data
      /* Update state */
      console.log("Data>>>" + data);// shows that excel data is read

      return results

    };
    console.log('asd')
    reader.readAsBinaryString(f);

    
  }

}

var removeFile = () => {
  var f = document.getElementById('file')
  f.value = ''
  file = ''

}

var convertToJson = (csv) => {
  var lines = csv.split("\n");

  var result = [];

  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}



var ExcelToJson = {
  readFile: readFile,
  removeFile: removeFile,
  filePathset: filePathset,
}

export default ExcelToJson;

