import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom'
import axios from '../services/api'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import Modal from './Modal'

const Professional = () =>{
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const fields = ['id','picture', 'name', 'gender', 'birthday', 'email', 'comment', 'deleted', 'fk_license', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))

  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id) => {
    setRowID(id)
  }

  const deleteRow = (rowID) => {
    axios.delete('/professionals/' + rowID, {
      headers: {
        authorization: user_info.accessToken
      }
    }).then(res => {
      alert(res.data.message)
      handleAddNew()
    }).catch(err => alert(err.message))
  }

  useEffect(() => {
      axios.get('/professionals', {
        headers: {
          authorization: user_info.accessToken
        }
      }).then(res => {
        if (res.data.professionals) {
          const val = res.data.professionals
          setProfessinalData(val)
        } else {
          history.push('/')
          localStorage.removeItem('user_info')
        }
      }).catch(err => alert(err.message))
  }, [status])

  useEffect(() => {
    if (rowID !== null){
      setShowModal(!showModal)
    }
  }, [rowID])

  function handleAddNew() {
    setStatus(status + 1)
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="12">
          <CCard>
            <CCardHeader >
              <CRow>
                <CCol>
                  <CButton onClick={()=>addOrEdit(-1)} className="px-5" color="info">+ Add New</CButton>
                  <Modal rowID={rowID}  display={showModal} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={professionalData}
                fields={fields}
                itemsPerPageSelect
                itemsPerPage={5}
                pagination
                tableFilter
                scopedSlots = {{
                  'id' : (item, index) => (
                      <td>
                        {index + 1}
                      </td>
                  ),
                  'picture': (item) => (
                    <td>
                      <div className={'c-avatar'}>
                        <img className={'c-avatar-img'} src={item.picture} alt={''}/>
                      </div>
                    </td>
                  ),
                  'gender':
                    (item)=>(
                      <td>
                        <CBadge shape={'pill'} color={item.gender === 0? 'info' : 'success'}>
                          {item.gender === 0? "Male" : "Female"}
                        </CBadge>
                      </td>
                    ),
                  'deleted':(item) => (
                     <td><CBadge color={item.deleted === 1? 'danger' : 'warning'}>{item.deleted === 1? 'Deleted': 'Working'}</CBadge></td>
                  ),
                  'action': (item) => (
                    <td width={102}>
                    <CRow>
                      <CCol>
                        <CButton onClick={(e)=> addOrEdit(item.id)} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_edit'} name={'cilPencil'} /></CButton>
                      </CCol>
                      <CCol>
                        <CButton onClick={(e) => deleteRow(item.id)}  className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_delete'} name={'cilTrash'}/></CButton>
                      </CCol>
                    </CRow>
                    </td>
                  )
                 }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  );
}
export default Professional
