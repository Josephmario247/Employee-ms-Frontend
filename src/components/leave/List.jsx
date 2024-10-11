import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const List = () => {
    const [leaves, setLeaves] = useState([])
    let sno = 1;
    const { id } = useParams()
    const { user } = useAuth()
    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                setLeaves(response.data.leaves)
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
        }
    }
    useEffect(() => {
        fetchLeaves()
    }, [])
    return (
        <div className='p-5'>
            <div className='text-center'>
                <h3 className='text-2xl font-bold'>Manage Leaves</h3>
            </div>
            <div className='flex justify-between items-center'>
                <input type="text" placeholder='Search By employee Name' className='px-4 py-0.5 rounded hover:shadow-md border' />
                {user.role === "employee" && (<Link to={'/employee-dashboard/add-leave'} className='px-4 py-1 bg-teal-600 rounded hover:shadow-md text-white'> Add New Leave</Link>)}
            </div>
            <div className='mt-6'>
                {/* <LeaveTable /> */}
                <table className='w-full text-sm text-left text-gray-500 mt-6'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200 '>
                        <tr>

                            <th className='px-6 py-3'>SNo</th>
                            <th className='px-6 py-3'> Leave Type</th>
                            <th className='px-6 py-3'>From</th>
                            <th className='px-6 py-3'>To</th>
                            <th className='px-6 py-3'>Description</th>
                            <th className='px-6 py-3'>Applied Date</th>
                            <th className='px-6 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leaves?.map((leave) => (
                                <tr key={leave._id} className='bg-white border-b dark:bg-gray-800 text-white dark:border-gray-700'>

                                    <td className='px-6 py-3'>{sno++}</td>
                                    <td className='px-6 py-3'>{leave.leaveType}</td>
                                    <td className='px-6 py-3'>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{leave.reason}</td>
                                    <td className='px-6 py-3'>{new Date(leave.appliedAt).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{leave.status}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default List