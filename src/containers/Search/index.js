import React from 'react';
import SearchService from '../../services/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { diff } from 'deep-object-diff';
import config from '../../config';
import './styles.css';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      pagination: {
        rowsPerPageOptions: config.pagination.rowsPerPageOptions,
        rowsPerPage: config.pagination.rowsPerPage,
        currentPage: config.pagination.currentPage,
      },
      queryValue: '',
      records: [],
      recordsSnapshot: null,
      selectedRecord: null,
      tables: [],
    };

    this.updatedRecord = null;
    this.SearchService = new SearchService();

    this.fetchTablesAndColumns = this.fetchTablesAndColumns.bind(this);
    this.displayError = this.displayError.bind(this);
    this.listRecords = this.listRecords.bind(this);
    this.searchDatabase = this.searchDatabase.bind(this);
    this.dismissRecord = this.dismissRecord.bind(this);
    this.displayRecord = this.displayRecord.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSelectedRecordUpdate = this.handleSelectedRecordUpdate.bind(
      this,
    );
  }

  async componentDidMount() {
    await this.fetchTablesAndColumns();
  }

  fetchTablesAndColumns() {
    return this.SearchService.init()
      .then(result => {
        let tables = result.tables.filter(table => table !== null);
        this.setState({
          tables,
        });
      })
      .catch(error => {
        this.displayError(config.errors.SQLError);
      });
  }

  displayError(error) {
    this.setState(
      {
        error,
      },
      () => {
        setTimeout(() => {
          this.setState({ error: null });
        }, 4000);
      },
    );
  }

  renderHeader() {
    const header = this.state.error ? this.state.error : 'BAM Database Client';
    return (
      <header className='row header-container'>
        <h4>{header}</h4>
      </header>
    );
  }

  handleSelectedRecordUpdate(evt, feature) {
    let { selectedRecord } = this.state;
    selectedRecord[feature] = evt.target.value;
    this.setState({
      selectedRecord,
    });
  }

  renderSelectedRecordsDataValueInput({ key, selectedRecord, feature }) {
    if (key === 0 || feature === 'id') {
      return <p style={{ fontSize: 20 }}>{selectedRecord[feature]}</p>;
    }
    return (
      <input
        type='text'
        className='record-card-data-value-input'
        value={selectedRecord[feature]}
        onChange={evt => this.handleSelectedRecordUpdate(evt, feature)}
      />
    );
  }

  getOriginalRecord(selectedRecord) {
    return this.state.records.filter(record => record.id === selectedRecord.id);
  }

  selectedRecordHasBeenAltered() {
    const { selectedRecord } = this.state;
    const originalRecord = this.getOriginalRecord(selectedRecord)[0];
    const diffReport = Object.keys(diff(originalRecord, selectedRecord));
    const diffExists = diffReport.length !== 0;
    if (diffExists) {
      this.updatedRecord = {
        columns: diffReport,
        values: diffReport.map(report => selectedRecord[report]),
      };
    }
    return diffExists;
  }

  displaySelectedRecordsData() {
    const { selectedRecord } = this.state;
    const recordFeatures = Object.keys(selectedRecord);
    return (
      <div className='row record-card-row'>
        {recordFeatures.map((feature, key) => {
          return (
            <div key={key} className='row container record-card-data-row'>
              <div className='col-4 container record-card-data-row-col'>
                <p className='record-card-data-feature-label'>{`${feature}:`}</p>
              </div>
              <div className='col-8 container record-card-data-row-col'>
                {this.renderSelectedRecordsDataValueInput({
                  key,
                  selectedRecord,
                  feature,
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderRecordCardHeader() {
    let selectedTable = this.getSelectedTable();
    selectedTable =
      selectedTable.length > 0 ? selectedTable[0].label : 'Select a table';
    return (
      <div className='row record-card-row'>
        <CloseIcon onClick={this.dismissRecord} />
        <h4 className='record-card-header-title'>{selectedTable}</h4>
      </div>
    );
  }

  renderUpdateRecordCardButton() {
    if (this.selectedRecordHasBeenAltered()) {
      return (
        <div className='row container'>
          <Button
            variant='contained'
            color='primary'
            className='update-record-button'
            onClick={this.updateRecord}
          >
            UPDATE
          </Button>
        </div>
      );
    }
  }

  renderRecordCard() {
    return (
      <div className='row container record-card'>
        {this.renderRecordCardHeader()}
        {this.displaySelectedRecordsData()}
        {this.renderUpdateRecordCardButton()}
      </div>
    );
  }

  getSelectedTable() {
    return this.state.tables.filter(table => table.selected);
  }

  renderTableDropdownLabel() {
    let selectedTable = this.getSelectedTable();
    return selectedTable.length > 0 ? selectedTable[0].label : 'Table';
  }

  handleTableSelected(label) {
    let newTables = this.state.tables.map(table => {
      table.selected = label === table.label ? true : false;
      return table;
    });
    this.setState({
      tables: newTables,
    });
  }

  listTables() {
    return this.state.tables.map((table, key) => {
      return (
        <a
          key={key}
          className='dropdown-item'
          href={`#${table.label}`}
          onClick={() => this.handleTableSelected(table.label)}
        >
          {table.label}
        </a>
      );
    });
  }

  getSelectedColumn() {
    let selectedTable = this.getSelectedTable();
    return selectedTable.length > 0
      ? selectedTable[0].columns.selectedColumn
      : null;
  }

  renderTableColumnDropdownLabel() {
    let selectedColumn = this.getSelectedColumn();
    return selectedColumn ? selectedColumn : 'Column';
  }

  handleTableColumnSelected(selectedColumn) {
    let newTables = this.state.tables.map(table => {
      if (table.selected) {
        table.columns.selectedColumn = selectedColumn;
      }
      return table;
    });
    this.setState({
      tables: newTables,
    });
  }

  listColumns() {
    return this.state.tables.map(table => {
      if (table.selected) {
        return table.columns.list.map((column, key) => {
          return (
            <a
              key={key}
              className='dropdown-item'
              href={`#${column}`}
              onClick={() => this.handleTableColumnSelected(column)}
            >
              {column}
            </a>
          );
        });
      }
    });
  }

  listRecords(table) {
    const { currentPage, rowsPerPage } = this.state.pagination;
    return this.SearchService.list({
      table: table[0].label,
      selectedColumn: table[0].columns.selectedColumn,
      columns: table[0].columns.list,
      queryValue: this.state.queryValue,
      offset: currentPage === 0 ? 0 : currentPage * rowsPerPage,
      limit: rowsPerPage,
    })
      .then(response => {
        if (response.error) {
          throw response.error;
        }
        const recordsSnapshot = this.state.records;
        this.setState({
          recordsSnapshot,
          records: response.records,
        });
      })
      .catch(error => {
        this.displayError(config.errors.SQLError);
      });
  }

  searchDatabase(event, fromSearchButton) {
    if (event.key !== 'Enter' && !fromSearchButton) {
      return;
    }
    const table = this.getSelectedTable();
    if (table.length === 0) return;

    this.listRecords(table);
  }

  updateQueryValue(queryValue) {
    this.setState({ queryValue });
  }

  renderTableDropdown() {
    return (
      <button
        className='btn btn-outline-secondary dropdown-toggle'
        type='button'
        data-toggle='dropdown'
        aria-haspopup='true'
        aria-expanded='false'
      >
        {this.renderTableDropdownLabel()}
      </button>
    );
  }

  renderTableColumnDropdown() {
    if (this.getSelectedTable().length > 0) {
      return (
        <button
          className='btn btn-outline-secondary dropdown-toggle'
          type='button'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          {this.renderTableColumnDropdownLabel()}
        </button>
      );
    }
  }

  renderSearchBar() {
    return (
      <div className='row search-bar-container'>
        <div className='input-group mb-3'>
          <div className='input-group-prepend'>
            {this.renderTableDropdown()}
            <div className='dropdown-menu'>{this.listTables()}</div>
          </div>
          <div className='input-group-prepend'>
            {this.renderTableColumnDropdown()}
            <div className='dropdown-menu'>{this.listColumns()}</div>
          </div>
          <input
            type='text'
            className='form-control search-input'
            placeholder='...'
            aria-label='...'
            aria-describedby='search-input'
            onChange={evt => this.updateQueryValue(evt.target.value)}
            onKeyDown={evt => this.searchDatabase(evt, false)}
            value={this.state.queryValue}
          />
          <div className='input-group-append'>
            <span
              className='input-group-text'
              id='search-button'
              onClick={evt => this.searchDatabase(evt, true)}
            >
              Search
            </span>
          </div>
        </div>
      </div>
    );
  }

  renderDataTableHeader() {
    let selectedTable = this.getSelectedTable();
    selectedTable =
      selectedTable.length > 0
        ? `${selectedTable[0].label}s`
        : 'Select a table';
    return (
      <Toolbar id='data-table-title-bar'>
        <div className='data-table-title-container'>
          <Typography variant='h6' id='data-table-title'>
            {selectedTable}
          </Typography>
        </div>
      </Toolbar>
    );
  }

  renderDataTableColumns(records) {
    const columns = Object.keys(records[0]);
    return (
      <TableHead>
        <TableRow>
          {columns.map((column, key) => (
            <TableCell key={key} align='left' padding='default'>
              {column}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  dismissRecord() {
    this.listRecords(this.getSelectedTable()).then(unused => {
      this.setState({
        displayRecord: false,
        selectedRecord: null,
      });
    });
  }

  displayRecord(event, selectedRecord) {
    this.setState({
      selectedRecord: {
        ...selectedRecord,
      },
      displayRecord: true,
    });
  }

  fetchRecordDetails(event, requestedFeatures) {
    this.SearchService.fetchRecord()
      .then(response => {
        if (response.error) {
          throw response.error;
        }
      })
      .catch(error => {
        this.displayError(config.errors.SQLError);
      });
  }

  updateRecord(event) {
    const { selectedRecord } = this.state;
    const selectedTable = this.getSelectedTable();
    this.SearchService.update({
      id: selectedRecord.id,
      table: selectedTable.length > 0 ? selectedTable[0].label : null,
      updatedColumns: this.updatedRecord.columns,
      updatedValues: this.updatedRecord.values,
    })
      .then(response => {
        if (response.error) {
          throw response.error;
        }
        this.listRecords(selectedTable);
      })
      .catch(error => {
        this.displayError(config.errors.SQLError);
      });
  }

  renderDataTableBody(records) {
    const columns = Object.keys(records[0]);
    return (
      <TableBody>
        {records.map((record, key) => {
          return (
            <TableRow
              hover
              key={key}
              onClick={event => this.displayRecord(event, record)}
              tabIndex={-1}
            >
              {columns.map((column, cKey) => {
                return (
                  <TableCell
                    key={cKey}
                    component='th'
                    id='data-table-row-value'
                    scope='row'
                  >
                    {record[column]}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  handleChangePage(event, currentPage) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        currentPage,
      },
    });
  }

  handleChangeRowsPerPage(event) {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          rowsPerPage: +event.target.value,
        },
      },
      () => this.handleChangePage(null, 0),
    );
  }

  renderDataTablePagination(records) {
    const { pagination } = this.state;
    return (
      <TablePagination
        rowsPerPageOptions={pagination.rowsPerPageOptions}
        component='div'
        count={records.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.currentPage}
        backIconButtonProps={{
          'aria-label': 'previous',
        }}
        nextIconButtonProps={{
          'aria-label': 'next',
        }}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
    );
  }

  renderDataTable() {
    const records = this.state.records;
    if (records.length === 0) {
      return (
        <div className='row data-table-container'>
          <Paper className='col-12 data-table-paper-wrapper'>
            {this.renderDataTableHeader()}
          </Paper>
        </div>
      );
    }
    return (
      <div className='row data-table-container'>
        <Paper className='col-12 data-table-paper-wrapper'>
          {this.renderDataTableHeader()}
          <div className='data-table-wrapper'>
            <Table
              className='data-table'
              aria-labelledby='tableTitle'
              size='medium'
            >
              {this.renderDataTableColumns(records)}
              {this.renderDataTableBody(records)}
            </Table>
          </div>
          {this.renderDataTablePagination(records)}
        </Paper>
      </div>
    );
  }

  renderBody() {
    if (this.state.displayRecord) {
      return this.renderRecordCard();
    }
    return (
      <div>
        {this.renderSearchBar()}
        {this.renderDataTable()}
      </div>
    );
  }

  render() {
    return (
      <div className='container'>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
