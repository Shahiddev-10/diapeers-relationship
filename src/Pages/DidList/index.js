import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';


const DidList = () => {

  const navigate = useNavigate()
  const token = localStorage.getItem("token") !== null ? localStorage.getItem('token') : null;
  const config = {
    headers: {
      'Content-Type': ' application/vnd.api+json',
      'Accept': ' application/vnd.api+json',
      'Authorization': `Bearer ${token}`,
    }
  };
  const [data, setData] = useState([])
  const [attributeHeading, setAttributeHeading] = useState([])
  const [relationshipsHeading, setRelationshipsHeading] = useState([])
  const [subHeading, setSubHeading] = useState([])
  let urlData = []
  let de = useRef(false)
  const [detailsResponse, setDetailsResponse] = useState([])
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/rest/admin/dialpeers`, config)
        if (response?.status === 200) {
          const res = response?.data?.data
          setData(res)

          if (res?.length) {
            const attribute = Object.entries(res[0]?.attributes || {}).map(([key, value]) => key)
            const relation = Object.entries(res[0]?.relationships || {}).map(([key, value]) => key)
            setRelationshipsHeading(relation)
            setAttributeHeading(attribute)
            const headers = attribute.concat(relation)

            setSubHeading(headers)
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    try {
      getData()
    } catch (error) {
      console.error(error);
    }
  }, [])




  const renderSelfTD = (selfData, key, index, mainIndex) => {

    const dataIndex = data?.length && data?.map((item, index) => index > 0 ? index * 8 : index)
    if (selfData?.relationships[key]?.links?.self) {
      const url = new URL(selfData?.relationships[key]?.links?.self);
      url.port = "82";
      const updatedUrl = url.toString();

      if (!urlData.length) {
        urlData.push(updatedUrl)
      } else {
        if (!urlData.includes(updatedUrl)) {
          urlData.push(updatedUrl)
        }
      }

      if (relationshipsHeading?.length - 1 === index && mainIndex === data?.length - 1 && de.current === false) {
        de.current = true;
        try {
          Promise.all(urlData.map(url => axios.get(url, config)))
            .then(response => {
              setDetailsResponse(response)
              return response;
            })
            .catch(error => {
              console.error("Error fetching data:", error);
              return [];
            });

        } catch (error) {
          console.error("Error fetching data:", error);
          throw error;
        }
      }
    }
    return <TableCell>{detailsResponse[index + dataIndex[mainIndex]]?.data?.data?.id ? detailsResponse[index + dataIndex[mainIndex]]?.data?.data?.id : "-"}</TableCell>;
  }



  return (
    <>
      <Button variant="contained" onClick={() => navigate("/customer")}>Go to customer page</Button>
      <TableContainer component={Paper}>
        <Table aria-label="json-table" border={2}>
          <TableHead >
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align='center' colSpan={attributeHeading?.length}>Attribute</TableCell>
              <TableCell align='center' colSpan={relationshipsHeading?.length * 2}>Relationship Name</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>-</TableCell>
              {subHeading?.length && subHeading?.map((heading, index) => {
                return (
                  <TableCell key={index} colSpan={index >= attributeHeading?.length ? 2 : 1} >{heading}</TableCell>
                )
              })}
            </TableRow>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell align='center' colSpan={attributeHeading?.length}>-</TableCell>
              {relationshipsHeading?.length && relationshipsHeading?.map((relation) => {
                return (
                  <React.Fragment key={relation}>
                    <TableCell>Related</TableCell>
                    <TableCell>Self</TableCell>
                  </React.Fragment>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length && data?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell key={index}>{item?.id}</TableCell>
                  {attributeHeading?.length && attributeHeading?.map((rec, i) => {
                    return (
                      <TableCell key={i}>{item?.attributes[rec] ? item?.attributes[rec] : "-"}</TableCell>
                    )
                  })}
                  {relationshipsHeading?.length && relationshipsHeading?.map((rec, i) => {
                    return (
                      <React.Fragment key={i}>
                        <TableCell>{item?.relationships[rec]?.links?.related ? item?.relationships[rec]?.links?.related : "-"}</TableCell>
                        {renderSelfTD(item, rec, i, index)}
                      </React.Fragment>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default DidList