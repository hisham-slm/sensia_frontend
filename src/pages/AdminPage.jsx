import React, { useState } from 'react';
import { User, MessageSquare, Eye, Plus, Users, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

export default function AdminDashboard() {
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"])
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);

  const [comments, setComments] = useState([]);

  // Create User Form
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const [newComment, setNewComment] = useState({ has_access: [], content: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editingUser, setEditingUser] = useState(null)
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}superadmin/get_users/`,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = response.data
        console.log(data)
        setUsers(data)
        console.log(users)
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}superadmin/get_comments`,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = response.data;
        setComments(data)
        return data
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, []);


  const handleEditClick = (comment) => {
    setSelectedComment(comment);
    setEditedContent(comment.content);
    setShowModal(true);
  };

  const handleUserEditClick = (comment) => {
    setSelectedComment(comment);
    setEditedContent(comment.content);
    setShowModal(true);
  };

  const handleLogout = () => {
    if (cookies.access_token) {
      removeCookie('access_token')
    }
    window.location.href = '/admin/login'
  }

  const addMarketing = async (user) => {
    const editData = {
      'id': user.id,
      'role': "marketing"
    }
    console.log(editData)
    const response = await axios.post(
      `${API_BASE_URL}superadmin/add_role/`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": 'application/json',
        }
      }
    )

    console.log(response)
  }

  const addSales = async (user) => {
    const editData = {
      'id': user.id,
      'role': "sales"
    }
    console.log(editData)
    const response = await axios.post(
      `${API_BASE_URL}superadmin/add_role/`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": 'application/json',
        }
      }
    )

    console.log(response)
  }

  const handleSave = async () => {

    const updated_comment = {
      "id": selectedComment.id,
      "content": editedContent
    }

    const response = await axios.post(
      `${API_BASE_URL}superadmin/edit_comment/`,
      updated_comment,
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": 'application/json',
        }
      }
    )

    console.log({ response })
    const status = response.status
    console.log({ status })

    if (status === 201) {
      toast.success((`Updated the comment with ID ${selectedComment.id}`))
    } else {
      toast.error("something went wrong")
    }

    setShowModal(false);
    setSelectedComment(null);
    setEditedContent('');
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (newUser.username && newUser.email) {
      const user = { ...newUser };
      setNewUser({ username: '', email: '' });

      try {
        const response = await axios.post(
          `${API_BASE_URL}superadmin/create_user/`,
          user,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = response.data
        console.log({ data })
        const statustext = response.statusText
        if (statustext === "Created") {
          toast.success(`user ${data.username} created successfully with ${data.role} role`)
        } else {
          toast.error("Comment didn't post something went wrong")
        }
      } catch (error) {
        console.error("error creating user:", error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.content) {
      console.log('in if')
      const comment = {
        ...newComment,
      };
      setComments([...comments, comment]);
      setNewComment({ has_access: [], content: '' });

      try {
        console.log(cookies.access_token)
        const response = await axios.post(
          `${API_BASE_URL}superadmin/add_comment/`,
          comment,
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const statustext = response.statusText
        if (statustext === "Created") {
          toast.success("Comment added successfully")
        } else {
          toast.error("Comment didn't post something went wrong")
        }
      } catch (error) {
        console.error("error creating user:", error);
      }
    }
  };

  const handleCommentAction = (commentId, action) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, status: action === 'approve' ? 'Approved' : 'Rejected' }
        : comment
    ));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Comments</p>
              <p className="text-2xl font-bold text-green-900">{comments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-yellow-900">
                {comments.filter(c => c.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab('create-user')}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <User className="h-8 w-8 text-blue-600 mb-3 " />
          <h3 className="text-lg font-semibold text-gray-900">Create User</h3>
          <p className="text-gray-600">Add new users to the system</p>
        </button>

        <button
          onClick={() => setActiveTab('add-comment')}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <Plus className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Add Comment</h3>
          <p className="text-gray-600">Create new comments</p>
        </button>

        <button
          onClick={() => setActiveTab('review-comments')}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <Eye className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Review Comments</h3>
          <p className="text-gray-600">Moderate pending comments</p>
        </button>
      </div>
    </div>
  );

  const renderCreateUser = () => (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h2>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              User Name
            </label>
            <input
              placeholder="Enter user name"
              type="text"
              id="username"
              value={newUser.username}
              onChange={(e) => {
                setNewUser({ ...newUser, username: e.target.value })
              }
              }
              className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={newUser.email}
              onChange={(e) => {
                setNewUser({ ...newUser, email: e.target.value })
              }
              }
              className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <button
            onClick={handleCreateUser}
            className="w-full bg-blue-600  text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddComment = () => (
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Comment</h2>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Comment Content
            </label>
            <textarea
              id="content"
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              rows={4}
              className="w-full bg-wht px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter comment content"
            />
          </div>

          <button
            onClick={handleAddComment}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviewUsers = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User Roles</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Users</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                  </div>
                  <p className="text-gray-700">{user.username}</p>
                  {/* <button onClick={() => handleUserEditClick(user)} className="mt-2 text-blue-600 hover:underline"> */}
                  {/*   Edit */}
                  {/* </button> */}
                  <div className='p-2 m-2 flex space-x-2'>
                    <button onClick={() => addMarketing(user)} type="">Add Marketing</button>
                    <button onClick={() => addSales(user)} type="">Add Sales</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewComments = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Comments</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <button onClick={() => handleEditClick(comment)} className="mt-2 text-blue-600 hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-3 bg-white py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'overview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('create-user')}
              className={`w-full flex items-center bg-white px-3 py-2 mt-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'create-user'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <User className="mr-3 h-5 w-5" />
              Create User
            </button>

            <button
              onClick={() => setActiveTab('edit-user')}
              className={`w-full flex items-center bg-white px-3 py-2 mt-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'edit-user'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <User className="mr-3 h-5 w-5" />
              Edit Users
            </button>

            <button
              onClick={() => setActiveTab('add-comment')}
              className={`w-full flex items-center px-3 bg-white py-2 mt-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'add-comment'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Plus className="mr-3 h-5 w-5" />
              Add Comment
            </button>

            <button
              onClick={() => setActiveTab('review-comments')}
              className={`w-full flex items-center px-3 py-2 mt-2 bg-white text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'review-comments'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Eye className="mr-3 h-5 w-5" />
              Review Comments
            </button>
          </div>

          <div onClick={handleLogout} className="mt-8 pt-6 border-t border-gray-200 px-3">
            <button className="w-full flex items-center px-3 py-2 text-sm bg-white font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <div className="p-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'create-user' && renderCreateUser()}
          {activeTab === 'add-comment' && renderAddComment()}
          {activeTab === 'review-comments' && renderReviewComments()}
          {activeTab === 'edit-user' && renderReviewUsers()}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Edit Comment</h2>
                <textarea
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
