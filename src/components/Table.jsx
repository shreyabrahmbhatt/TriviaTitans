import React from "react";
import { useTable, usePagination } from "react-table";
import { Table, Container, Row, Col } from "react-bootstrap";
import "../styles/leaderboard.css";

export default function TableComponent({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  return (
    <Container>
      <Table
        striped
        bordered
        hover
        responsive
        {...getTableProps()}
        className="tableContainer"
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              key={index}
              {...headerGroup.getHeaderGroupProps()}
              className="tableHeaderRow"
            >
              {headerGroup.headers.map((column, i) => (
                <th
                  key={i}
                  {...column.getHeaderProps()}
                  className="tableHeaderCell"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()} className="tableBodyRow">
                {row.cells.map((cell, i) => (
                  <td
                    key={i}
                    {...cell.getCellProps()}
                    className="tableBodyCell"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {data.length > 0 && (
        <Row className="pagination">
          <Col xs={4} className="text-center">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>
          </Col>
          <Col xs={4} className="text-center">
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
          </Col>
          <Col xs={4} className="text-center">
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
          </Col>
        </Row>
      )}
    </Container>
  );
}
