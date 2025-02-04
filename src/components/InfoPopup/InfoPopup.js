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
              potentially imperfect). The app is also not optimized for everyday
              use (speed, concurrent usage), but rather for demonstration
              purposes.
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
              in Helsinki Region. You may compare routes from the shortest to
              the least polluted or quietest and find your own optimal way. The
              more you value peaceful and pleasant urban environments, the
              longer routes you may be ready to take.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Data & Methods
            </Typography>
            <Typography variant="body1" gutterBottom>
              Street network data is downloaded from OpenStreetMap (CC-BY-SA)
              using BBBike extracts OpenStreetMap service.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hourly air quality index (AQI) is derived from the FMI-ENFUSER
              high-resolution modelling system.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Traffic noise data is based on an assessment conducted by the city
              of Helsinki, City of Espoo, City of Vantaa and Kauniainen. It is a
              modelled GIS data representing typical traffic noise levels.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Green view (i.e. greenery) layer is derived from analyzing Google
              Street View images (Toikka et al. 2020) and openly available land
              cover data by Helsinki Region Infoshare. The dataset is covering
              Helsinki, so Espoo and Vantaa are not included.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Team
            </Typography>
            <Typography variant="body1" gutterBottom>
              Green path 2.0 routing tool is developed by the Digital Geography
              Lab, University of Helsinki, within the Urban Air Quality 2.0, a
              joint project between the University of Helsinki, Finnish
              Meteorological Institute and Helsinki Region Environmental
              Services Authority HSY. The project is continuum of the Urban
              Innovative Action: HOPE – Healthy Outdoor Premises for Everyone.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Code
            </Typography>
            <Typography variant="body1" gutterBottom>
              <a
                href="https://github.com/DigitalGeographyLab/green-paths-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                DigitalGeographyLab/green-paths-2
              </a>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <a
                href="https://github.com/DigitalGeographyLab/green-paths-2-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                DigitalGeographyLab/green-paths-2-ui
              </a>
            </Typography>

            {/* Sponsor Logos */}
            <Typography variant="h6" gutterBottom>
              Sponsors:
            </Typography>
            <Typography variant="body1" gutterBottom>
              GREENTRAVEL project is funded by the European Research Council
              (ERC). Urban Airquality 2.0 project is funded by Technology
              Industries of Finland Centennial Foundation.
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
              <div
                className="navbar-row info-popup-sponsors"
                style={{ widht: '100% !important' }}
              >
                <img
                  className="uaq2-logo"
                  src={`${process.env.PUBLIC_URL}/UAQ20_Logo_Eng.png`}
                  alt="UAQ 2.0 LOGO"
                />
                <img
                  src={`${process.env.PUBLIC_URL}/ALL_logos_disclaimer.jpg`}
                  alt="SPONSOR Logos"
                  style={{ width: '100% !important' }}
                />
              </div>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InfoPopup;
