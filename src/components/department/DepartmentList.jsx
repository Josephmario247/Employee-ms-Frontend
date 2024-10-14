import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper'
import axios from 'axios'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [filterDep, setFilterdep] = useState([])

  const onDepartmentDelete =  () => {
    fetchDepartments();
    
  }
  const fetchDepartments = async () => {
    setDepLoading(true)
    try {
      const response = await axios.get("https://employee-ms-backend.vercel.app/api/department", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        let sno = 1;
        const data = await response.data.departments.map((dep) => (
          {
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (<DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />)

          }
        ))
        setDepartments(data)
        setFilterdep(data)
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    } finally {
      setDepLoading(false)
    }
  }// Fetching deapartments from database
  useEffect(() => {
    fetchDepartments();
  }, [])

  const filterDepartments = (e) => {
    const value = e.target.value.toLowerCase()
    const filteredData = departments.filter(dep => dep.dep_name.toLowerCase().includes(value))
    setFilterdep(filteredData)
  }
  return (
    <>{depLoading ? <div>Loading....</div> :
      <div className='p-5'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold'>Manage Departments</h3>
        </div>
        <div className='flex justify-between items-center'>
          <input type="text" placeholder='Search By Dpt Name' onChange={filterDepartments} className='px-4 py-0.5 rounded hover:shadow-md border' />
          <Link to={'/admin-dashboard/add-department'} className='px-4 py-1 bg-teal-600 rounded hover:shadow-md text-white'> Add New Department</Link>
        </div>
        <div className='mt-5'>
          <DataTable columns={columns} data={filterDep} pagination />
        </div>
      </div>
    }</>
  )
}

export default DepartmentList