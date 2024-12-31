import React, { Component } from "react";
import { connect } from "react-redux";
import OpenIcon from "@material-ui/icons/OpenInNew";
import Pagination from "@material-ui/lab/Pagination";
import FolderIcon from "@material-ui/icons/Folder";
import LockIcon from "@material-ui/icons/Lock";
import UnlockIcon from "@material-ui/icons/LockOpen";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import DeleteIcon from "@material-ui/icons/Delete";

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    withStyles,
} from "@material-ui/core";
import API from "../../middleware/Api";
import TypeIcon from "../FileManager/TypeIcon";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import { VisibilityOff, VpnKey } from "@material-ui/icons";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { withRouter } from "react-router-dom";
import ToggleIcon from "material-ui-toggle-icon";
import { formatLocalTime } from "../../utils/datetime";
import { toggleSnackbar } from "../../redux/explorer";
import Nothing from "../Placeholder/Nothing";
import { withTranslation } from "react-i18next";

const styles = (theme) => ({
    cardContainer: {
        padding: theme.spacing(1),
    },
    card: {
        maxWidth: 400,
        margin: "0 auto",
    },
    actions: {
        display: "flex",
    },
    layout: {
        width: "auto",
        marginTop: "50px",
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
            width: 1100,
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    shareTitle: {
        maxWidth: "200px",
    },
    avatarFile: {
        backgroundColor: theme.palette.primary.light,
    },
    avatarFolder: {
        backgroundColor: theme.palette.secondary.light,
    },
    gird: {
        marginTop: "30px",
    },
    loadMore: {
        textAlign: "right",
        marginTop: "20px",
        marginBottom: "40px",
    },
    badge: {
        marginLeft: theme.spacing(1),
        height: 17,
    },
    orderSelect: {
        textAlign: "right",
        marginTop: 5,
    },
});
const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleSnackbar: (vertical, horizontal, msg, color) => {
            dispatch(toggleSnackbar(vertical, horizontal, msg, color));
        },
    };
};

class MyShareCompoment extends Component {
    state = {
        page: 1,
        total: 0,
        shareList: [],
        showPwd: null,
        orderBy: "created_at DESC",
    };

    componentDidMount = () => {
        this.loadList(1, this.state.orderBy);
    };

    showPwd = (pwd) => {
        this.setState({ showPwd: pwd });
    };

    handleClose = () => {
        this.setState({ showPwd: null });
    };

    removeShare = (id) => {
        API.delete("/share/" + id)
            .then(() => {
                let oldList = this.state.shareList;
                oldList = oldList.filter((value) => {
                    return value.key !== id;
                });
                this.setState({
                    shareList: oldList,
                    total: this.state.total - 1,
                });
                this.props.toggleSnackbar(
                    "top",
                    "right",
                    this.props.t("share.shareCanceled"),
                    "success",
                );
                if (oldList.length === 0) {
                    this.loadList(1, this.state.orderBy);
                }
            })
            .catch((error) => {
                this.props.toggleSnackbar(
                    "top",
                    "right",
                    error.message,
                    "error",
                );
            });
    };

    changePermission = (id) => {
        const newPwd = Math.random().toString(36).substr(2).slice(2, 8);
        const oldList = this.state.shareList;
        const shareIndex = oldList.findIndex((value) => {
            return value.key === id;
        });
        API.patch("/share/" + id, {
            prop: "password",
            value: oldList[shareIndex].password === "" ? newPwd : "",
        })
            .then((response) => {
                oldList[shareIndex].password = response.data;
                this.setState({
                    shareList: oldList,
                });
            })
            .catch((error) => {
                this.props.toggleSnackbar(
                    "top",
                    "right",
                    error.message,
                    "error",
                );
            });
    };

    changePreviewOption = (id) => {
        const oldList = this.state.shareList;
        const shareIndex = oldList.findIndex((value) => {
            return value.key === id;
        });
        API.patch("/share/" + id, {
            prop: "preview_enabled",
            value: oldList[shareIndex].preview ? "false" : "true",
        })
            .then((response) => {
                oldList[shareIndex].preview = response.data;
                this.setState({
                    shareList: oldList,
                });
            })
            .catch((error) => {
                this.props.toggleSnackbar(
                    "top",
                    "right",
                    error.message,
                    "error",
                );
            });
    };

    loadList = (page, orderBy) => {
        const order = orderBy.split(" ");
        API.get(
            "/share?page=" +
                page +
                "&order_by=" +
                order[0] +
                "&order=" +
                order[1],
        )
            .then((response) => {
                this.setState({
                    total: response.data.total,
                    shareList: response.data.items,
                });
            })
            .catch(() => {
                this.props.toggleSnackbar(
                    "top",
                    "right",
                    this.props.t("share.listLoadingError"),
                    "error",
                );
            });
    };

    handlePageChange = (event, value) => {
        this.setState({
            page: value,
        });
        this.loadList(value, this.state.orderBy);
    };

    handleOrderChange = (event) => {
        this.setState({
            orderBy: event.target.value,
        });
        this.loadList(this.state.page, event.target.value);
    };

    isExpired = (share) => {
        return share.expire < -1 || share.remain_downloads === 0;
    };

    render() {
        const { classes, t } = this.props;

        return (
            <div className={classes.layout}>
                <Grid container>
                    <Grid sm={6} xs={6}>
                        <Typography color="textSecondary" variant="h4">
                            {t("share.sharedFiles")}
                        </Typography>
                    </Grid>
                    <Grid sm={6} xs={6} className={classes.orderSelect}>
                        <FormControl>
                            <Select
                                color={"secondary"}
                                onChange={this.handleOrderChange}
                                value={this.state.orderBy}
                            >
                                <MenuItem value={"created_at DESC"}>
                                    {t("share.createdAtDesc")}
                                </MenuItem>
                                <MenuItem value={"created_at ASC"}>
                                    {t("share.createdAtAsc")}
                                </MenuItem>
                                <MenuItem value={"downloads DESC"}>
                                    {t("share.downloadsDesc")}
                                </MenuItem>
                                <MenuItem value={"downloads ASC"}>
                                    {t("share.downloadsAsc")}
                                </MenuItem>
                                <MenuItem value={"views DESC"}>
                                    {t("share.viewsDesc")}
                                </MenuItem>
                                <MenuItem value={"views ASC"}>
                                    {t("share.viewsAsc")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={classes.gird}>
                    {this.state.shareList.length === 0 && (
                        <Nothing primary={t("share.noRecords")} />
                    )}
                    {this.state.shareList.map((value) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={value.id}
                            className={classes.cardContainer}
                        >
                            <Card className={classes.card}>
                                <CardHeader
                                    avatar={
                                        <div>
                                            {!value.is_dir && (
                                                <TypeIcon
                                                    fileName={
                                                        value.source
                                                            ? value.source.name
                                                            : ""
                                                    }
                                                    isUpload
                                                />
                                            )}{" "}
                                            {value.is_dir && (
                                                <Avatar
                                                    className={
                                                        classes.avatarFolder
                                                    }
                                                >
                                                    <FolderIcon />
                                                </Avatar>
                                            )}
                                        </div>
                                    }
                                    title={
                                        <Tooltip
                                            placement="top"
                                            title={
                                                value.source
                                                    ? value.source.name
                                                    : t("share.sourceNotFound")
                                            }
                                        >
                                            <Typography
                                                noWrap
                                                className={classes.shareTitle}
                                            >
                                                {value.source
                                                    ? value.source.name
                                                    : t("share.sourceNotFound")}
                                            </Typography>
                                        </Tooltip>
                                    }
                                    subheader={
                                        <span>
                                            {formatLocalTime(value.create_date)}
                                            {this.isExpired(value) && (
                                                <Chip
                                                    size="small"
                                                    className={classes.badge}
                                                    label={t("share.expired")}
                                                />
                                            )}
                                        </span>
                                    }
                                />
                                <Divider />
                                <CardActions
                                    disableActionSpacing
                                    style={{
                                        display: "block",
                                        textAlign: "right",
                                    }}
                                >
                                    <Tooltip
                                        placement="top"
                                        title={t("fileManager.open")}
                                    >
                                        <IconButton
                                            onClick={() =>
                                                this.props.history.push(
                                                    "/s/" +
                                                        value.key +
                                                        (value.password === ""
                                                            ? ""
                                                            : "?password=" +
                                                              value.password),
                                                )
                                            }
                                        >
                                            <OpenIcon fontSize={"small"} />
                                        </IconButton>
                                    </Tooltip>{" "}
                                    {value.password !== "" && (
                                        <>
                                            <Tooltip
                                                placement="top"
                                                title={t(
                                                    "share.changeToPublic",
                                                )}
                                                onClick={() =>
                                                    this.changePermission(
                                                        value.key,
                                                    )
                                                }
                                            >
                                                <IconButton>
                                                    <LockIcon
                                                        fontSize={"small"}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip
                                                placement="top"
                                                title={t("share.viewPassword")}
                                                onClick={() =>
                                                    this.showPwd(value.password)
                                                }
                                            >
                                                <IconButton>
                                                    <VpnKey
                                                        fontSize={"small"}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                    {value.password === "" && (
                                        <Tooltip
                                            placement="top"
                                            title={t("share.changeToPrivate")}
                                            onClick={() =>
                                                this.changePermission(value.key)
                                            }
                                        >
                                            <IconButton>
                                                <UnlockIcon
                                                    fontSize={"small"}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip
                                        placement="top"
                                        title={
                                            value.preview
                                                ? t("share.disablePreview")
                                                : t("share.enablePreview")
                                        }
                                        onClick={() =>
                                            this.changePreviewOption(value.key)
                                        }
                                    >
                                        <IconButton>
                                            <ToggleIcon
                                                on={value.preview}
                                                onIcon={
                                                    <EyeIcon
                                                        fontSize={"small"}
                                                    />
                                                }
                                                offIcon={
                                                    <VisibilityOff
                                                        fontSize={"small"}
                                                    />
                                                }
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                        placement="top"
                                        title={t("share.cancelShare")}
                                        onClick={() =>
                                            this.removeShare(value.key)
                                        }
                                    >
                                        <IconButton>
                                            <DeleteIcon fontSize={"small"} />
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <div className={classes.loadMore}>
                    <Pagination
                        count={Math.ceil(this.state.total / 18)}
                        onChange={this.handlePageChange}
                        color="secondary"
                    />
                </div>{" "}
                <Dialog
                    open={this.state.showPwd !== null}
                    onClose={this.handleClose}
                >
                    <DialogTitle> {t("share.sharePassword")} </DialogTitle>{" "}
                    <DialogContent>
                        <TextField
                            id="standard-name"
                            value={this.state.showPwd}
                            margin="normal"
                            autoFocus
                        />
                    </DialogContent>{" "}
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">
                            {t("close", { ns: "common" })}
                        </Button>{" "}
                    </DialogActions>{" "}
                </Dialog>{" "}
            </div>
        );
    }
}

const MyShare = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(withRouter(withTranslation()(MyShareCompoment))));

export default MyShare;
