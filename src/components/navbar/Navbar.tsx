import React, { ReactNode } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  ClickAwayListener,
  Fade,
  IconButton,
  Popper,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme, Theme, CSSObject, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StorageIcon from "@mui/icons-material/Storage";
import StarIcon from "@mui/icons-material/Star";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MuiListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AccountCircle } from "@mui/icons-material";
import { signIn, signOut, useSession } from "next-auth/react";
import { CenterLoader } from "../CenterLoader";
import { useRouter } from "next/router";

interface Props {
  children?: ReactNode;
}

const ListItem = styled((props: Props) => (
  <MuiListItem disablePadding sx={{ display: "block" }} {...props} />
))(
  ({ theme }) => `
        color: ${theme.palette.primary.main};
        &:hover {
            background-color: ${theme.palette.secondary.light};
            color: white;
            & .MuiListItemIcon-root {
                color: white;
            }
        }
  `
);

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `0px`,
  borderWidth: "0px",
  [theme.breakpoints.up("xl")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  [theme.breakpoints.between(1350, "xl")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  [theme.breakpoints.between(1310, 1350)]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export function Navbar() {
  const { data: sessionData, status } = useSession();

  const router = useRouter();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    if (open) {
      setOpen(false);
    }
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const handlePopper = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setAccountOpen((prev) => !prev);
  };

  return (
    <ClickAwayListener onClickAway={handleDrawerClose}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1 }}
              align="left"
            >
              THE SKI DB
            </Typography>
            <Popper
              open={accountOpen}
              anchorEl={anchorEl}
              placement="bottom-end"
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Card sx={{ minWidth: 250 }}>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Account
                      </Typography>
                      <Typography variant="h5" component="div">
                        {sessionData?.user?.name}
                      </Typography>
                      <Typography color="secondary.light">
                        {sessionData?.user?.email}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <button
                        className="rounded-md border border-red-500 bg-gray-50 px-3 py-1 text-xl shadow-lg hover:cursor-pointer hover:bg-red-50"
                        onClick={() => signOut()}
                      >
                        Sign out
                      </button>
                    </CardActions>
                  </Card>
                </Fade>
              )}
            </Popper>
            {status === "loading" ? (
              <CenterLoader />
            ) : sessionData ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) => handlePopper(e)}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
            ) : (
              <button
                className="rounded-md border border-red-500 bg-gray-50 px-3 py-1 text-xl shadow-lg hover:cursor-pointer hover:bg-red-50"
                onClick={() => signIn()}
              >
                Sign in
              </button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {[
              { name: "SkiDB", link: "/skis", icon: <StorageIcon /> },
              { name: "Favorites", link: "/favorites", icon: <StarIcon /> },
              { name: "Buyer's Guide", link: "/guide", icon: <MenuBookIcon /> },
            ].map((navItem, index) => (
              <>
                <ListItem key={navItem.link}>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerClose();
                      router.push(navItem.link);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {navItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={navItem.name}
                      primaryTypographyProps={{
                        color: "inherit",
                      }}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <DrawerHeader />
        </Box>
      </Box>
    </ClickAwayListener>
  );
}
