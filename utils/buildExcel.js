
import xl from 'excel4node';


export default function BuildExcel(nodes, edges, outputPath = './output/BOM.xlsx') {
  //Require library

  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('Parts');
  var ws2 = wb.addWorksheet('BOMs');

  // for each cyNode
  for (let i = 0; i < nodes.length; i++) {
    ws.cell(i + 1, 1).string(nodes[i].data.id)
    ws.cell(i + 1, 2).string(nodes[i].data.name)
    ws.cell(i + 1, 4).string(nodes[i].data.name)
    ws.cell(i + 1, 6).string(nodes[i].data.description)
  }

  for (let i = 0; i < edges.length; i++) {
    ws2.cell(i + 1, 1).string(edges[i].data.source)
    ws2.cell(i + 1, 2).string(edges[i].data.target)
    ws2.cell(i + 1, 3).string(edges[i].data.id)
    ws2.cell(i + 1, 4).number(edges[i].data.qty)
  }

  wb.write(outputPath);
}