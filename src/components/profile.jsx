import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap';
import AuthDetails from './AuthDetails';
import { Image } from 'react-bootstrap';
import { Button ,Form , Row , Col } from 'react-bootstrap';
import { useEffect , useState} from 'react';
import { updateProfile , updatePhoneNumber} from 'firebase/auth';
import defaultImage from "../assets/avatar.jpeg";
import axios from 'axios';
import { toast } from 'react-toastify';


const Profile = () =>  {

    const { authUser, userSignOut } = AuthDetails();
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [gamePlayed,setGamesPlayed] = useState();
    const [gameWon,setGamesWon] = useState();
    const [points,setPoints] = useState();
    const [imageUrl, setImageUrl] = useState('');

    //console.log(authUser.email);
    //console.log(authUser.displayName);
    //console.log(authUser.phoneNumber);
    //console.log(authUser.photoURL);


    const userid = window.sessionStorage.getItem('user_id');
    const email = window.sessionStorage.getItem('user_email');
    console.log(userid);
    console.log(email)

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
      };

      const handleSaveChanges = () => {
        updateProfile(authUser, {
          displayName: name,
          photoURL: 'https://i.imgur.com/ffvDyUG.jpeg',
        })
          .then(() => {
            console.log('Base64 Image Data:', image);
            console.log('Phone:', phone);
            console.log('UserID:', userid);
            console.log('Name:', name);
            console.log('Email:', email);
    
            const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Image = reader.result.split(',')[1];
            console.log('Image data to be sent:', base64Image); // Log the image data before sending
    
            // Replace 'YOUR_LAMBDA_API_ENDPOINT' with the actual API endpoint to trigger your Lambda function
            const url = 'https://hbjk0da8se.execute-api.us-east-1.amazonaws.com/prod/';
            //const url = 'https://zeqdzxhu4ukgxapff7wdy2nuoi0vztri.lambda-url.us-east-1.on.aws/';
    
            const userid = window.sessionStorage.getItem("user_id")
            const email = window.sessionStorage.getItem("user_email")
            console.log(userid)
            console.log(email)
    
            const requestBody = {
              userid,
              email,
              name,
              phone,
              image_data: JSON.stringify(base64Image),
            };
            console.log(requestBody)
            const response = await axios.post(url, requestBody);
    
            console.log('Response:', response.data); // Log the response from Lambda (if any)
    
            // Handle the success response
            toast.success('Form submitted successfully');
            setName('');
            setPhone('');
            setImage('');
            // window.location.href = `/user/${response.data.userId}`;
            console.log(email);
            fetchUserData(email);
            window.location.reload();

          } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Form submission failed');
          }
        };
    
          reader.readAsDataURL(image);
          })
          .catch((error) => {
            console.log(error);
          });
        setIsEditing(false);
      };
      const fetchUserData = async (email) => {
        try {
          console.log(email)
          const response = await axios.post('https://hbjk0da8se.execute-api.us-east-1.amazonaws.com/prod/showdetails', { email });
          //console.log("response data")
          //console.log(response.data); // This will log the response data
          //console.log("here is userData")
          //console.log(userData)
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      useEffect(() => {
        const getTeamData = async () => {
          try {
            const mail = authUser.email;
            const res = await axios.post('https://hbjk0da8se.execute-api.us-east-1.amazonaws.com/prod/showdetails', { email });
            console.log("User Details")
            console.log(JSON.parse(res.data.body)[0]);
            setName(JSON.parse(res.data.body)[0].name)
            setPhone(JSON.parse(res.data.body)[0].contact);
            setGamesPlayed(JSON.parse(res.data.body)[0].games_played);
            setGamesWon(JSON.parse(res.data.body)[0].games_won);
            setPoints(JSON.parse(res.data.body)[0].points_earned);
            setImageUrl(JSON.parse(res.data.body)[0].imageLink);

          } catch (error) {
            console.log(error);
          }
        };
        getTeamData();
      }, [authUser]);
    


  return (
    <>
    {authUser ? (
        <>
      <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/">Trivia Fun</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/statistics">Statisctics</Nav.Link>
                <NavDropdown title="Teams" id="navbarScrollingDropdown">
                <NavDropdown.Item href="/create">Create team</NavDropdown.Item>
                <NavDropdown.Item href="/view">
                  View Team
                </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/invite">
                    Invite a member
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/viewinvite">
                    View Invitations
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Navbar.Text>Hello, {authUser.email}</Navbar.Text>
                <Nav.Link onClick={userSignOut} href="/login">Logout</Nav.Link>
              </Nav>
            </Container>
        </Navbar>
        
    <div >
        
    <Form
    style={{
      padding: '20px',
      textAlign: 'center',
      backgroundImage: 'src/assets/bg.jpg', // Replace with your image URL
      backgroundSize: 'cover', // Adjust as needed
      backgroundRepeat: 'repeat', // Adjust as needed
    }}
    >
    {/* {imageUrl && (
                <>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label></Form.Label>
                    <Image height={200} width={200} src={imageUrl} roundedCircle />
                  </Form.Group>
                  <br />
                </>
              )}
        <br/> */}
        <Image height={200} width={200} src={imageUrl} roundedCircle />
              <br />
              {isEditing && (
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label>Profile Image</Form.Label><br />
                  <Form.Control
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    disabled={!isEditing}
                  />
                </Form.Group>
              )}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Name
        </Form.Label>
        <Col sm="10">
            <Form.Control type="text" defaultValue={name} placeholder={name} disabled={!isEditing} readOnly={!isEditing} onChange={(e) => setName(e.target.value)}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Email
        </Form.Label>
        <Col sm="10">
            <Form.Control type="text" placeholder={authUser.email}  disabled readOnly />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Phone
        </Form.Label>
        <Col sm="10">
            <Form.Control type="text" defaultValue={phone} placeholder={phone}  disabled={!isEditing} readOnly={!isEditing} onChange={(e) => setPhone(e.target.value)}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Games Played
        </Form.Label>
        <Col sm="10">
            <Form.Control type="text" placeholder={gamePlayed}  disabled readOnly />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Games Won
        </Form.Label>
        <Col sm="10">
            <Form.Control type="text" placeholder={gameWon}  disabled readOnly />
        </Col>
      </Form.Group>


      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Points earned
        </Form.Label>
        <Col sm="10">
            <Form.Control type="text" placeholder={points}  disabled readOnly />
        </Col>
      </Form.Group>

      {isEditing ? (
        <Button variant="outline-success" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      ) : (
        <Button variant="outline-primary" onClick={handleEditProfile}>
          Edit Profile
        </Button>
      )}

    </Form>
        
    </div>
        </>
        ) : (<></>)}
    </>
  );
}

export default Profile;
