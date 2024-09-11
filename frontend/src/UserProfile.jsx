import React, { useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import dscvr_logo from "/dscvr_logo.svg"

// Initialize the GraphQL client with the DSCVR endpoint
const client = new GraphQLClient('https://api.dscvr.one/graphql');

// Define the GraphQL query for fetching user data by username
const GET_USER_DATA = gql`
  query GetUserData($username: String!) {
    userByName(name: $username) {
      id
      followingCount
      followerCount
      dscvrPoints
    }
  }
`;

const UserProfile = ({ username }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (username) => {
    try {
      setLoading(true);
      const data = await client.request(GET_USER_DATA, { username });
      setUserData(data.userByName);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(username);
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return userData ? (
    <div>
      <p className='flex justify-start gap-5'>
        <div className='text-center flex gap-1.5'>
        <span className='font-medium'>{userData.followerCount}</span>
        <span className='text-indigo-400 text-center'>Followers</span>
        </div>
        <div className='text-center flex gap-1.5'>
        <span className='font-medium'>{userData.followingCount}</span>
        <span className='text-indigo-400 text-center'>Following</span>
        </div>
      </p>
      <p className='my-2 flex gap-1.5'> 
        <img src={dscvr_logo} className='mx-[-8px] w-[30px] inline logo' alt="DSCVR Points" />
        <span>{userData.dscvrPoints/1e6}</span>
      </p>
    </div>
  ) : (
    <div>No user data found</div>
  );
};

export default UserProfile;
