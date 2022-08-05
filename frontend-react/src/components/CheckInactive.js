import React, { useEffect } from 'react';
import axios from 'axios';

function CheckInactive(props) {
    const id = props.publisher;
    useEffect(() => {
        async function checkInactive() {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/publishers/inactive/${id}`, config);
    
            } catch(err) {
                console.log(err);
            }
        }
        checkInactive();
    }, [id])

    return (
        <div />
    )
}

export default CheckInactive
