import { useState } from "react"
import { Box, Button, CircularProgress, Grid, Link, makeStyles, Typography } from "@material-ui/core"
import { AddSharp, ArrowBackSharp } from "@material-ui/icons"
import ButtonLink from "./ButtonLink"
import AddMemberModal from "./AddMemberModal"
import AddTargetModal from "./AddTargetModal"
import RoleMember from "./RoleMember"
import RoleTarget from "./RoleTarget"
import { Role } from "../typings/role"
import { useRootSelector } from "../store"
import { getTransactionError, getTransactionPending } from "../store/main/selectors"

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    position: "relative",
    flexGrow: 1,
    padding: 1,
    "&::before": {
      content: '" "',
      position: "absolute",
      zIndex: 1,
      top: "0px",
      left: "0px",
      right: "0px",
      bottom: "0px",
      border: "1px solid rgba(217, 212, 173, 0.3)",
      pointerEvents: "none",
    },
  },
  errorSpacing: {
    marginTop: theme.spacing(2),
  },
  img: {
    borderRadius: "50%",
    border: "1px solid rgba(217, 212, 173, 0.3)",
    padding: 4,
    width: 68,
  },
  item: {
    border: "1px solid rgba(217, 212, 173, 0.3)",
    height: "100%",
    padding: theme.spacing(2),
  },
  label: {
    color: theme.palette.text.primary,
    lineHeight: 1,
  },
  labelLink: {
    color: "rgba(217,212,173, 0.6)",
    cursor: "pointer",
    lineHeight: 1,
    "&:hover": {
      color: "rgba(217,212,173, 0.3)",
    },
  },
  labelWrapper: {
    alignItems: "flex-end",
    display: "flex",
    justifyContent: "space-between",
  },
  sideBar: {
    paddingRight: "0 !important",
    "& $item": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
  },
  mainPanelZeroState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  viewRolesLink: {
    color: "rgb(217,212,173)",
    cursor: "pointer",
    fontSize: 16,
    textDecoration: "none !important",
    textUnderlineOffset: "2px",
    "&:hover": {
      textDecoration: "underline !important",
    },
  },
}))

type Props = {
  role: Role
}

const RoleView = ({ role }: Props) => {
  const classes = useStyles()
  const isWaiting = useRootSelector(getTransactionPending)
  const error = useRootSelector(getTransactionError)
  const [AddMemberModalIsOpen, setAddMemberModalIsOpen] = useState(false)
  const [AddTargetModalIsOpen, setAddTargetModalIsOpen] = useState(false)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          mt: 1,
        }}
      >
        <Typography variant="h4">Create a new role</Typography>
        <ButtonLink text="View all roles" icon={<ArrowBackSharp fontSize="small" />} />
      </Box>

      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={4} lg={3} className={classes.sideBar}>
          <Box className={classes.item}>
            <Box>
              <Typography variant="h5">Role #1</Typography>
              <Box
                sx={{
                  bgcolor: "rgba(217, 212, 173, 0.1)",
                  height: 1,
                  my: 2,
                  width: "100%",
                }}
              />
              <Box className={classes.labelWrapper}>
                <Typography variant="body1" className={classes.label}>
                  Members
                </Typography>
                <Link href="#">
                  <Typography variant="body2" className={classes.labelLink}>
                    What's a member?
                  </Typography>
                </Link>
              </Box>
              <Box sx={{ mt: 1 }}>
                {role.members.length > 0 ? (
                  <>
                    {role.members.map((member) => {
                      return <RoleMember id={member.member.id} address={member.member.address} />
                    })}
                    <Link onClick={() => setAddMemberModalIsOpen(true)} underline="none">
                      <ButtonLink text="Add a Member" icon={<AddSharp fontSize="small" />} />
                    </Link>
                  </>
                ) : (
                  <Button
                    fullWidth
                    color="secondary"
                    size="large"
                    variant="contained"
                    onClick={() => setAddMemberModalIsOpen(true)}
                    startIcon={<AddSharp />}
                  >
                    Add a Member
                  </Button>
                )}
              </Box>
              <Box className={classes.labelWrapper} sx={{ mt: 4 }}>
                <Typography variant="body1" className={classes.label}>
                  Targets
                </Typography>
                <Link href="#">
                  <Typography variant="body2" className={classes.labelLink}>
                    What's a target?
                  </Typography>
                </Link>
              </Box>
              <Box sx={{ mt: 1 }}>
                {role.targets.length > 0 ? (
                  <>
                    {role.targets.map((target, id) => {
                      return <RoleTarget id={id} address={target.address} />
                    })}
                    <Link onClick={() => setAddTargetModalIsOpen(true)} underline="none">
                      <ButtonLink text="Add a Target" icon={<AddSharp fontSize="small" />} />
                    </Link>
                  </>
                ) : (
                  <Button
                    fullWidth
                    color="secondary"
                    size="large"
                    variant="contained"
                    onClick={() => setAddTargetModalIsOpen(true)}
                    startIcon={<AddSharp />}
                  >
                    Add a Target
                  </Button>
                )}
              </Box>
            </Box>
            <Button
              fullWidth
              color="secondary"
              size="large"
              variant="contained"
              // onClick={onSubmit}
              disabled={isWaiting}
              startIcon={isWaiting ? <CircularProgress size={18} color="primary" /> : <AddSharp />}
            >
              {isWaiting ? "Creating role..." : "Create role"}
            </Button>
          </Box>

          {error != null && (
            <Typography color="error" className={classes.errorSpacing}>
              {error}
            </Typography>
          )}
        </Grid>
        <Grid item xs={8} lg={9}>
          <Box className={classes.item}>
            {/* If the role has no targets set */}
            <Box className={classes.mainPanelZeroState}>
              <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="body1" align="center">
                  You currently have no targets associated with this role.
                  <br />
                  Once you’ve added a target, you can configure the permissions here.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Link href="#" underline="none">
                    <ButtonLink icon={<ArrowBackSharp fontSize="small" />} text="Go back to Roles" />
                  </Link>
                </Box>
              </Box>
            </Box>

            {/* If the role has at least one target set, set the first target in the list as active */}
            {/* <RoleParameters /> */}
          </Box>
        </Grid>
      </Grid>
      <AddMemberModal isOpen={AddMemberModalIsOpen} onClose={() => setAddMemberModalIsOpen(false)} role={role} />
      <AddTargetModal isOpen={AddTargetModalIsOpen} onClose={() => setAddTargetModalIsOpen(false)} />
    </>
  )
}

export default RoleView
