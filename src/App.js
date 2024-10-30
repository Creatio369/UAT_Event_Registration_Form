import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MuiTelInput } from "mui-tel-input";

const dietaryRequirementsOptions = [
  { label: "Vegetarian", value: "7a510b08-ae44-4007-8165-5c41a212383a" },
  { label: "Vegan", value: "77186a3d-c4b1-4ab0-8f25-57bc3e30dad8" },
  { label: "Gluten Free", value: "804a98ef-68df-4b2f-a4cd-cac13d4c57a4" },
  { label: "Dairy Free", value: "3e262b06-a3cb-4a3a-85ad-c54a7858a632" },
  { label: "Nut Allergy", value: "1605b692-2687-43d7-a15d-15c34ab71a76" },
  { label: "Halal", value: "609a2269-d1c3-4b62-8edb-caf19e8d5fd2" },
  { label: "No Beef or Pork", value: "3334e14e-76df-4267-88ba-ef797b138411" },
  { label: "Other (free text)", value: "Other (free text)" },
];

const EventRegistrationForm = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventVenue: "",
    title: "",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    practiceName: "",
    dietaryRequirements: "",
    otherDietaryRequirement: "",
    AHPRANumber: "",
    RACGP: "",
    OtherCPD: "",
    termsAndConditionsAccepted: false,
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFormData((prevData) => ({
      ...prevData,
      eventId: urlParams.get("eventId") || "",
      eventName: urlParams.get("eventName") || "",
      eventDate: urlParams.get("eventDate") || "",
      eventVenue: urlParams.get("eventVenue") || "",
    }));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const filteredFormData = {
      ...formData,
      dietaryRequirements: formData.otherDietaryRequirement || formData.dietaryRequirements,
    };
    delete filteredFormData.otherDietaryRequirement;
    delete filteredFormData.termsAndConditionsAccepted;

    Object.keys(filteredFormData).forEach((key) => {
      if (filteredFormData[key] === "") {
        delete filteredFormData[key];
      }
    });

    const queryParams = new URLSearchParams(filteredFormData).toString();
    const baseURL =
      "https://dev-sjghc.creatio.com/0/ServiceModel/UsrAnonymousEventRegistrationService.svc/CreateEvent";
    const fullURL = `${baseURL}?${queryParams}`;
    window.location.href = fullURL;
    setShowSnackbar(true);
  };

  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDietaryRequirementsChange = (_, selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      dietaryRequirements: selectedOptions.map((option) => option.value).join(","),
      otherDietaryRequirement: selectedOptions.some((option) => option.value === "Other (free text)")
        ? prevData.otherDietaryRequirement
        : "",
    }));
  };

  return (
    <Paper elevation={3} className="w-fit my-12 mx-auto py-10">
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        message="Event registered successfully."
        action={
          <IconButton
            aria-label="close"
            size="small"
            color="inherit"
            onClick={() => setShowSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      <Container>
        <Typography variant="h3" align="center">
          Event Registration
        </Typography>

        <form onSubmit={handleFormSubmit}>
          <Typography variant="h5" className="pt-6 pb-2">
            Event Details
          </Typography>

          <TextField fullWidth margin="normal" label="Event Name" name="eventName" value={formData.eventName} disabled />
          <TextField fullWidth margin="normal" label="Event Date" name="eventDate" value={formData.eventDate} disabled />
          <TextField fullWidth margin="normal" label="Event Venue" name="eventVenue" value={formData.eventVenue} disabled />

          <Typography variant="h5" className="pt-9 pb-2">
            Participant Details
          </Typography>

          <TextField fullWidth margin="normal" label="Title" name="title" value={formData.title} required onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="First Name" name="firstName" value={formData.firstName} required onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Last Name" name="lastName" value={formData.lastName} required onChange={handleInputChange} />
          <MuiTelInput fullWidth margin="normal" label="Mobile" name="mobile" value={formData.mobile} defaultCountry="AU" required onChange={(value) => setFormData({ ...formData, mobile: value })} />
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} required onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Practice Name" name="practiceName" value={formData.practiceName} required onChange={handleInputChange} />

          <Autocomplete
            multiple
            options={dietaryRequirementsOptions}
            disableCloseOnSelect
            onChange={handleDietaryRequirementsChange}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" margin="normal" label="Dietary Requirements" required={!formData.dietaryRequirements} />
            )}
          />
          {formData.dietaryRequirements.includes("Other (free text)") && (
            <TextField fullWidth margin="normal" label="Please specify" name="otherDietaryRequirement" value={formData.otherDietaryRequirement} onChange={handleInputChange} />
          )}

          <TextField fullWidth margin="normal" label="AHPRA Number" name="AHPRANumber" value={formData.AHPRANumber} required onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="RACGP #" name="RACGP" value={formData.RACGP} required onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Other CPD #" name="OtherCPD" value={formData.OtherCPD} required onChange={handleInputChange} />

          <FormControlLabel
            control={
              <Checkbox
                name="termsAndConditionsAccepted"
                checked={formData.termsAndConditionsAccepted}
                required
                onChange={handleInputChange}
              />
            }
            label={
              <span>
                I acknowledge the{" "}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setOpenModal(true)}
                  sx={{
                    color: 'blue',
                    padding: 0,
                    lineHeight: 0,
                    '&:hover': {
                      textDecoration: 'underline',
                      backgroundColor: 'none'
                    }
                  }}
                >
                  terms & conditions
                </Button>
              </span>
            }
            className="pt-2 pb-4"
          />

          <Box component="div" className="flex justify-center pt-5">
            <Button variant="contained" type="submit" className="w-72">
              Submit
            </Button>
          </Box>
        </form>
      </Container>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="terms-and-conditions-title"
        aria-describedby="terms-and-conditions-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "90vh",
            bgcolor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <IconButton aria-label="close" onClick={() => setOpenModal(false)} sx={{ position: "absolute", right: 8, top: 8, color: "#f44336" }}>
            <CloseIcon />
          </IconButton>
          <Typography id="terms-and-conditions-title" variant="h5" component="h2" sx={{ mb: 3, fontWeight: "bold", color: "#3f51b5" }}>
            Terms & Conditions
          </Typography>
          <Typography id="terms-and-conditions-description" sx={{ mt: 2, fontSize: "1rem", lineHeight: 1.6, color: "#424242" }}>
            <b style={{ color: "#3f51b5" }}>St John of God Health Care</b> is committed to upholding the dignity of each person.
            Guided by the value of respect, we will manage all personal information in accordance with privacy legislation.
            <br />
            <br />
            Further information about our privacy policy can be found here:{" "}
            <a href="https://sjog.org.au" target="_blank" rel="noopener noreferrer" style={{ color: "#ff4081" }} className="hover:underline">
              Privacy Policy

            </a>.
            <br />
            <br />
            <b style={{ color: "#3f51b5" }}>Photography at events</b>
            <br />
            Photographs taken during events will be used solely for the promotion of GP education. If you do not wish to have your photograph taken, please notify our staff during the event.
            <br />
            <br />
            <b style={{ color: "#3f51b5" }}>Event registration and personal information</b>
            <br />
            Your privacy is important to us. We collect personal information to provide updates on upcoming GP education events.
            We will not share your information with third parties without your consent.
            <br />
            <br />
            <b>We do not use your personal information for direct marketing</b>, but we may send emails related to event registration, such as:
            <ol style={{ marginLeft: "20px", color: "#616161" }}>
              <li>1. Event confirmations</li>
              <li>2. Reminder notifications</li>
            </ol>
            <br />
            If you prefer not to receive emails from us, you can opt out at any time by selecting the <b>"unsubscribe"</b> option.
          </Typography>
        </Box>
      </Modal>
    </Paper>
  );
};

const App = () => <EventRegistrationForm />;

export default App;
