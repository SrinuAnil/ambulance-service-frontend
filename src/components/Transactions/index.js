import { useEffect, useState } from "react";
import styled from "styled-components";
import { backend_api } from "../../constant";

const Container = styled.div`
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    max-width: 600px;
    margin: 20px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
`;

const ListItem = styled.li`
    background: ${(props) => (props.type === "credit" ? "#d4edda" : "#f8d7da")};
    color: ${(props) => (props.type === "credit" ? "#155724" : "#721c24")};
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SmallText = styled.small`
    color: #666;
`;

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const customer = JSON.parse(localStorage.getItem("customer"));

    useEffect(() => {
        fetch(`${backend_api}/transactions/${customer._id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setTransactions(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching transactions:", err);
                setLoading(false);
            });
    }, []);

    return (
        <Container>
            <Title>Transaction History</Title>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <List>
                    {transactions.length === 0 ? 
                        <p style={{"textAlign":"center"}}>No Transactions Found</p>
                    :
                        transactions.map((txn, index) => (
                            <ListItem key={index} type={txn.type}>
                                <div>
                                    <strong>{txn.type.toUpperCase()}</strong>: ${txn.amount} - {txn.description}
                                </div>
                                <SmallText>{new Date(txn.timestamp).toLocaleString()}</SmallText>
                            </ListItem>
                        ))
                    }
                    
                </List>
            )}
        </Container>
    );
}

export default TransactionHistory;
