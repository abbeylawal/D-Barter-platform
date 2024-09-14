import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <h1>Profile</h1>
      <div>
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>
        {/* Display additional profile information as needed */}
      </div>
    </div>
  );
};

export default Profile;
