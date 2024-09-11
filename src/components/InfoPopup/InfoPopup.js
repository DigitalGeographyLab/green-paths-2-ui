import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import './InfoPopup.css'; // External CSS file

const InfoPopup = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Overlay div to prevent map interaction when popup is open */}
      {open && <div className="info-popup-overlay"></div>}

      {/* IconButton for Info */}
      <IconButton
        aria-label="info"
        onClick={handleClickOpen}
        className="info-popup-button"
      >
        <InfoIcon className="info-icon" />
      </IconButton>

      {/* Dialog (Popup) */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: 'info-popup-dialog',
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="close-button"
        >
          <CloseIcon />
        </IconButton>

        {/* Popup Content */}
        <DialogTitle>
          <Typography variant="h6"> Welcome to Green Paths 2.0!</Typography>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="body1" gutterBottom>
              The app is a prototype and it is not developed or maintained
              currently. Therefore it may not be functional at all times and its
              street data is outdated (please consider the route suggestions as
              potentially imperfect).
            </Typography>

            <Typography variant="h6" gutterBottom>
              Problem
            </Typography>
            <Typography variant="body1" gutterBottom>
              While fresh air, quietness and greenery bring health benefits, air
              pollution and excess noise may cause physical and mental health
              problems such as respiratory infections, cardiovascular disease,
              or stress. Fortunately, a more peaceful, less polluted, and
              greener (= healthier) route may be just slightly longer than the
              shortest one.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Solution
            </Typography>
            <Typography variant="body1" gutterBottom>
              This tool guides you to take pleasant walks to your destinations
              in Helsinki. You may compare routes from the shortest to the least
              polluted or quietest and find your own optimal way. The more you
              value peaceful and pleasant urban environments, the longer routes
              you may be ready to take.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Data & Methods
            </Typography>
            <Typography variant="body1" gutterBottom>
              Street network data is downloaded from OpenStreetMap (CC-BY-SA)
              and processed into a street network graph with OpenTripPlanner.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hourly air quality index (AQI) is derived from the FMI-ENFUSER
              high-resolution modelling system.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Traffic noise data is based on an assessment conducted by the city
              of Helsinki (CC BY 4.0). It is a modelled GIS data representing
              typical traffic noise levels.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Green view (i.e. greenery) layer is derived from analyzing Google
              Street View images (Toikka et al. 2020) and openly available land
              cover data by HRI.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Team
            </Typography>
            <Typography variant="body1" gutterBottom>
              Green path routing tool is developed by the Digital Geography Lab,
              University of Helsinki, within the Urban Innovative Action: HOPE –
              Healthy Outdoor Premises for Everyone.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Code
            </Typography>
            <Typography variant="body1" gutterBottom>
              <a
                href="https://github.com/DigitalGeographyLab/hope-green-path-server"
                target="_blank"
                rel="noopener noreferrer"
              >
                DigitalGeographyLab/hope-green-path-server
              </a>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <a
                href="https://github.com/DigitalGeographyLab/hope-green-path-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                DigitalGeographyLab/hope-green-path-ui
              </a>
            </Typography>

            <Typography variant="body1" gutterBottom>
              HOPE project is co-financed by the European Regional Development
              Fund through the Urban Innovative Actions Initiative.
            </Typography>

            {/* Sponsor Logos */}
            <Typography variant="h6" gutterBottom>
              Sponsors:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                marginTop: 2,
              }}
            >
              <img
                src="https://via.placeholder.com/100x100.png?text=HYLogo"
                alt="University of Helsinki Logo"
                style={{ width: 80, height: 80 }}
              />
              <img
                src="https://via.placeholder.com/100x100.png?text=HopeLogo"
                alt="Hope Project Logo"
                style={{ width: 80, height: 80 }}
              />
              <img
                src="https://via.placeholder.com/100x100.png?text=UIALogo"
                alt="UIA Logo"
                style={{ width: 80, height: 80 }}
              />
              <img
                src="https://via.placeholder.com/100x100.png?text=EULogo"
                alt="EU Logo"
                style={{ width: 80, height: 80 }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InfoPopup;
