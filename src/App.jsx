import { Component } from "react";
import './App.css';

const API_URL = "https://jsonplaceholder.typicode.com/users";

class DataFatcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      error: null,
      filteredData: [],
      searchQuery: '',
      selectedUser: null, // State for selected user
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      this.setState({ data, loading: false, filteredData: data });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.filterData();
    }
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  filterData = () => {
    const { data, searchQuery } = this.state;
    if (searchQuery.trim() === '') {
      this.setState({ filteredData: data });
    } else {
      const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.setState({ filteredData });
    }
  };

  handleUserClick = (user) => {
    this.setState({ selectedUser: user });
  };

  closeUserDetail = () => {
    this.setState({ selectedUser: null });
  };

  renderError = () => {
    const { error } = this.state;
    return error ? <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{`Error: ${error}`}</div> : null;
  };

  render() {
    const { filteredData, searchQuery, loading, selectedUser } = this.state;

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Data</h1>

        {this.renderError()}

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={this.handleSearchChange}
            placeholder="Search by name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">City</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => this.handleUserClick(item)}>
                      <td className="py-3 px-6">{item.name}</td>
                      <td className="py-3 px-6">{item.email}</td>
                      <td className="py-3 px-6">{item.address.city}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-3 px-6 text-center">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={this.fetchData}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Fetch Data
        </button>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">{selectedUser.name}</h2>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Website:</strong> {selectedUser.website}</p>
              <p><strong>Company:</strong> {selectedUser.company.name}</p>
              <p><strong>City:</strong> {selectedUser.address.city}</p>
              <div className="mt-4">
                <button
                  onClick={this.closeUserDetail}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DataFatcher;
