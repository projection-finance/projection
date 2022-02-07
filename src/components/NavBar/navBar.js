import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

export default function NavBar({ routers }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [selectedIndex, setSelectdIndex] = React.useState(0);
  const title = "Projection.finance";
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSelectdIndexChange = (index) => {
    setSelectdIndex(index);
    handleCloseNavMenu();
  };

  React.useEffect(() => {
    routers.forEach((route, index) => {
      if (route.path === window.location.pathname) {
        setSelectdIndex(index);
      }
    });
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {routers.map((page, index) => (
                <MenuItem
                  key={index}
                  onClick={(e) => handleSelectdIndexChange(index)}
                  style={{
                    backgroundColor:
                      index === selectedIndex ? "rgba(33, 37, 41, 0.4)" : "",
                  }}
                >
                  <Link
                    to={page.path}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "black",
                      }}
                      textAlign="center"
                    >
                      {page.name}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
              <MenuItem>
                <Typography
                  sx={{
                    color: "black",
                  }}
                  textAlign="center"
                >
                  Connect to web 3
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {routers.map((page, index) => (
              <Link
                key={index}
                onClick={(e) => handleSelectdIndexChange(index)}
                to={page.path}
                style={{
                  textDecoration: "none",
                }}
              >
                <Button
                  onClick={(e) => handleSelectdIndexChange(index)}
                  sx={{
                    my: 2,
                    ml: 10,
                    color: "white",
                    display: "block",
                    backgroundColor:
                      index === selectedIndex ? "rgba(33, 37, 41, 0.4)" : "",
                  }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}

            <Button
              sx={{
                my: 2,
                ml: "auto",
                color: "white",
                display: "block",
                border: "1px solid white",
              }}
            >
              Connect to web 3
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
