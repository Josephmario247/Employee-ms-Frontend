import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'

const List = () => {
    const [employees, setEmployees] = useState([])
  const [empLoading, setEmpLoading] = useState(false)
  const [filteredEmployee, setFilteredEmployee] = useState([])

  // Fetching deapartments from database
  useEffect(() => {
    const fetchEmployees= async () => {
      setEmpLoading(true)
      try {
        const response = await axios.get("https://employee-ms-backend.vercel.app/api/employee", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.employees.map((emp) => (
            {
              _id: emp._id,
              sno: sno++,
              dep_name: emp.department.dep_name,
              name: emp.userId.name,
              dob: new Date(emp.dob).toLocaleDateString(),
              profileImage: <img width={40} className='rounded-full' src={`https://employee-ms-backend.vercel.app/${emp.userId.profileImage}`} alt="profileImage" />,
              action: (<EmployeeButtons id={emp._id}/>)

            }
          ))
          setEmployees(data)
          setFilteredEmployee(data)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setEmpLoading(false)
      }
    }
    fetchEmployees();
  }, [])

  const handleFilter = (e) => {
    const records = employees.filter((emp) => (
        emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    setFilteredEmployee(records)
  }

  return (
    <div className='p-5'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold'>Manage Employee</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By employee Name' onChange={handleFilter} className='px-4 py-0.5 rounded hover:shadow-md border' />
          <Link to={'/admin-dashboard/add-employee'} className='px-4 py-1 bg-teal-600 rounded hover:shadow-md text-white'> Add New Employee</Link>
        </div>
        <div className='mt-6'>
            <DataTable columns={columns} data={filteredEmployee} pagination/>
        </div>
    </div>
  )
}

export default List