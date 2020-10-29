import React from "react";

import BTable from "react-bootstrap/Table";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import {
  usePagination,
  useSortBy,
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { DateTime } from "luxon";

import {
  GrGoogle,
  GrFacebook,
  GrApple,
  GrHelp,
  GrMail,
  GrLinkedin,
} from "react-icons/gr";

import "./Table.css";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";


const renderTime = ({ value }) => {
  const dt = DateTime.fromISO(value);
  return (
    <span title={dt.toLocaleString(DateTime.DATETIME_FULL)}>
      {dt.toLocaleString()}
    </span>
  );
};
const renderName = ({ row, value }) => {
  return (
    <span>
      <Link to={`/user/${row.original.uid}`}>{value}</Link> {!!row.original.disabled && "🛑"}
    </span>
  );
};

const renderUID = ({ value }) => {
  return (
    <span>
      <Link to={`/user/${value}`}>{value}</Link>
    </span>
  );
};

const renderEmail = ({ row, value }) => (
  <span>
    {value} {!!row.original.emailVerified && "✅"}
  </span>
);
const renderClaims = ({ row, value }) => <>
<ul className="claimList">{!!value && Object.keys(value).map((k) => <li><strong>{`${k}`}</strong>{`: ${value[k]}`}</li>)}</ul>
<Link to={`/claims/${row.original.uid}`}>Edit</Link>
</>;
const renderProviders = ({ value }) => {
  return (
    !!value?.length &&
    value.map((provider) => {
      switch (provider.providerId) {
        case "password":
          return <GrMail title="Password" />;
        case "google.com":
          return <GrGoogle title="Google" />;
        case "facebook.com":
          return <GrFacebook title="Facebook" />;
        case "apple.com":
          return <GrApple title="Apple" />;
        case "linkedin.com":
          return <GrLinkedin title="LinkedIn" />;
        default:
          return <GrHelp title="Unknown" />;
      }
    })
  );
};

const columns = [
  {
    Header: "Picture",
    accessor: "photoURL",
    Cell: ({ value }) => !!value && <img src={value} width="70" height="70" />,
  },
  {
    Header: "Name",
    accessor: "displayName",
    Cell: renderName,
  },
  {
    Header: "Email",
    accessor: "email",
    Cell: renderEmail,
  },
  {
    Header: "Signin",
    accessor: "creationTime",
    Cell: renderTime,
  },
  {
    Header: "Last seen",
    accessor: "lastSignInTime",
    Cell: renderTime,
  },
  {
    Header: "Custom claims",
    accessor: "claims",
    Cell: renderClaims,
  },
  {
    Header: "Firebase UID",
    accessor: 'uid',
    Cell: renderUID,
  },
  {
    Header: "Providers",
    accessor: "providers",
    Cell: renderProviders,
  },
];

export default ({ data }) => {
  const {
    getTableProps,
    headers,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  // Render the UI for your table
  return (
    <>
      <ButtonToolbar className="justify-content-between">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="btnGroupAddon2">Search</InputGroup.Text>
          </InputGroup.Prepend>

          <Form.Control
            type="text"
            value={value || ""}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={`${count} records...`}
          />
        </InputGroup>

        <ButtonGroup>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </Button>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </Button>
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </ButtonGroup>

        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="btnGroupAddon2">
              Page {pageIndex + 1} of {pageOptions.length}
            </InputGroup.Text>
          </InputGroup.Prepend>

          <Form.Control
            as="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Control>
        </InputGroup>
      </ButtonToolbar>

      <BTable striped bordered hover size="sm" {...getTableProps()}>
        <thead>
          {headers.map((column) => (
            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render("Header")}
              <span>
                {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
              </span>
            </th>
          ))}
        </thead>
        <tbody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
    </>
  );
};
