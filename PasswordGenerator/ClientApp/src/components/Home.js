import React, {Component, useEffect, useState} from 'react';

function Home() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [userId, setUserId] = useState('Default user');
    const [sentUserId, setSentUserId] = useState(userId);
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
        const getPassword = async () => {
            console.log(isFetching,isLoaded,counter);
            if (!isFetching && (!isLoaded || counter === 0)) {
                setFetching(true);
                try {
                    const fetchResponse = await fetch('Password?userId=' + encodeURIComponent(userId));
                    const responseData = await fetchResponse.json();
                    const validUntil = Math.round(Date.parse(responseData.date) / 1000);
                    const now = Math.round(new Date().getTime() / 1000);
                    setCounter(validUntil - now);
                    setResponse(responseData);
                    setSentUserId(userId);
                } catch (e) {
                    setError(e.message);

                } finally {
                    setFetching(false);
                    setIsLoaded(true);
                }
            }
        }
        getPassword();
    }, [isLoaded,isFetching,counter]);
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        console.log(userId,sentUserId);
        return (
            <div className="pl-5">
                <div className="row justify-content-center pt-3">
                <input className="w-25 form-control" type="text" value={userId} onChange={(event) => {
                    setUserId(event.target.value);
                }}/>
                </div>
                
                <div className="row justify-content-center pt-3">
                    <h1 className="title">Your Password:</h1>
                    <p className="text pl-2">{response.generatedPassword}</p>
                </div>

                <div className="row justify-content-center pt-3">
                    <h1 className="title">Time remaining:</h1>
                    <p className="text pl-2">{counter}</p>
                </div>

                <div className="row justify-content-center pt-3">
                    <button onClick={() => {
                        setIsLoaded(false);
                    }} type="button" className="btn btn-primary btn-lg"
                            disabled={counter > 0 && userId === sentUserId}>Generate new password
                    </button>
                </div>
            </div>
        );
    }
}

export default Home;
