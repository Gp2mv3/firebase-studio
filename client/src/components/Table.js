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
  GrEdit,
  GrTrash,
  GrPause,
  GrRefresh,
  GrDownload,
} from "react-icons/gr";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import "./Table.css";
import { fetchDelete } from "../services/networkManager";


const deleteUser = (uid) => () => {
  if(window.confirm(`Are you sure you want to delete user ${uid} ?`)) {
      fetchDelete(`user/${uid}`);
  }
};

const downloadResults = (page) => () => {
  let output = 'uid,name,email,"signin","last seen",photo\n';
  output += page.map(({original: p}) => (`${p.uid},"${p.displayName||""}",${p.email||""},${p.creationTime||""},${p.lastSignInTime||""},${p.photoURL||""}`)).join('\n');

  const encodedData = encodeURI(output);
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodedData);
  link.setAttribute('download', 'export.csv');
  document.body.appendChild(link);
  link.click();
}

const disableUser = (uid) => () => {
  return alert("Not yet implemented");
  /*
  if(window.confirm(`Are you sure you want to disable user ${uid} ?`)) {

  }
  */
};

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
      <Link to={`/user/${row.original.uid}`}>{value}</Link>{" "}
      {!!row.original.disabled && "🛑"}
    </span>
  );
};

const renderEmail = ({ row, value }) => (
  <span>
    {value} {!!row.original.emailVerified && "✅"}
  </span>
);

const renderClaims = ({ row, value }) => (
  <>
    {!!value && (
      <ul className="claimList">
        {Object.keys(value).map((k) => (
          <li>
            <strong>{`${k}`}</strong>
            {`: ${value[k]}`}
          </li>
        ))}
      </ul>
    )}
    <Link to={`/claims/${row.original.uid}`}>Edit</Link>
  </>
);

const renderButtons = ({ row }) => (
    <ButtonGroup className="buttonsWithIcons">
      <LinkContainer to={`/user/${row.original.uid}`}>
        <Button>
          <GrEdit title="Edit" />
        </Button>
      </LinkContainer>
      <Button onClick={deleteUser(row.original.uid)}>
        <GrTrash title="Delete" />
      </Button>
      <Button onClick={disableUser(row.original.uid)}>
        <GrPause title="Disable" />
      </Button>
    </ButtonGroup>
);

const renderProviders = ({ value }) => {
  return (
    !!value?.length &&
    value.map((provider) => {
      switch (provider.providerId) {
        case "password":
          return <GrMail title="Password" key={provider.providerId} />;
        case "google.com":
          return <GrGoogle title="Google" key={provider.providerId} />;
        case "facebook.com":
          return <GrFacebook title="Facebook" key={provider.providerId} />;
        case "apple.com":
          return <GrApple title="Apple" key={provider.providerId} />;
        case "linkedin.com":
          return <GrLinkedin title="LinkedIn" key={provider.providerId} />;
        default:
          return <GrHelp title="Unknown" key={provider.providerId} />;
      }
    })
  );
};

const columns = [
  {
    Header: "Picture",
    accessor: "photoURL",
    Cell: ({ value }) => !!value && <img src={value} title={value} alt={value} width="70" height="70" />,
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
    accessor: "uid",
  },
  {
    Header: "Providers",
    accessor: "providers",
    Cell: renderProviders,
  },
  {
    Header: "Actions",
    Cell: renderButtons,
  },
];

export default ({ data, onFetch }) => {
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

        {onFetch && (<Button onClick={onFetch}><GrRefresh /> Refresh</Button>)}

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

        <Button onClick={downloadResults(page)}><GrDownload /> Download</Button>
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
