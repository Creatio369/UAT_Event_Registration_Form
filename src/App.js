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
    RACGPNumber: "",
    otherCPDNumber: "",
    termsAndConditionsAccepted: false,
  });
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFormData((prevData) => ({
      ...prevData,
      eventName: urlParams.get("eventName") || "",
      eventDate: urlParams.get("eventDate") || "",
      eventVenue: urlParams.get("eventVenue") || "",
    }));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const filteredFormData = {
      ...formData,
      dietaryRequirements:
        formData.otherDietaryRequirement || formData.dietaryRequirements,
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
      dietaryRequirements: selectedOptions
        .map((option) => option.value)
        .join(","),
      otherDietaryRequirement: selectedOptions.some(
        (option) => option.value === "Other (free text)"
      )
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

          <TextField
            fullWidth
            margin="normal"
            label="Event Name"
            name="eventName"
            value={formData.eventName}
            disabled
          />

          <TextField
            fullWidth
            margin="normal"
            label="Event Date"
            name="eventDate"
            value={formData.eventDate}
            disabled
          />

          <TextField
            fullWidth
            margin="normal"
            label="Event Venue"
            name="eventVenue"
            value={formData.eventVenue}
            disabled
          />

          <Typography variant="h5" className="pt-9 pb-2">
            Participant Details
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={formData.title}
            required
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            required
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            required
            onChange={handleInputChange}
          />

          <MuiTelInput
            fullWidth
            margin="normal"
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            defaultCountry={"AU"}
            required
            onChange={(value) => setFormData({ ...formData, mobile: value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            required
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Practice Name"
            name="practiceName"
            value={formData.practiceName}
            required
            onChange={handleInputChange}
          />

          <Autocomplete
            multiple
            options={dietaryRequirementsOptions}
            disableCloseOnSelect
            onChange={handleDietaryRequirementsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                margin="normal"
                label="Dietary Requirements"
                required={!formData.dietaryRequirements}
              />
            )}
          />
          {formData.dietaryRequirements.includes("Other (free text)") && (
            <TextField
              fullWidth
              margin="normal"
              label="Please specify"
              name="otherDietaryRequirement"
              value={formData.otherDietaryRequirement}
              onChange={handleInputChange}
            />
          )}

          <TextField
            fullWidth
            margin="normal"
            label="AHPRA Number"
            name="AHPRANumber"
            value={formData.AHPRANumber}
            required
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="RACGP #"
            name="RACGPNumber"
            value={formData.RACGPNumber}
            required
            onChange={handleInputChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Other CPD #"
            name="otherCPDNumber"
            value={formData.otherCPDNumber}
            required
            onChange={handleInputChange}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="termsAndConditionsAccepted"
                checked={formData.termsAndConditionsAccepted}
                required
                onChange={handleInputChange}
              />
            }
            label="I acknowledge the terms & conditions"
            className="pt-2 pb-4"
          />

          <Box component="div" className="flex justify-center pt-5">
            <Button variant="contained" type="submit" className="w-72">
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    </Paper>
  );
};

const App = () => <EventRegistrationForm />;

export default App;
