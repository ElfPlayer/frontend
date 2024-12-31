import React, { useCallback, useState } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
} from "@material-ui/core";
import PathSelector from "../FileManager/PathSelector";
import { useDispatch } from "react-redux";
import API from "../../middleware/Api";
import {
    refreshFileList,
    setModalsLoading,
    toggleSnackbar,
} from "../../redux/explorer";
import { Trans, useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    contentFix: {
        padding: "10px 24px 0px 24px",
    },
    wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    },
    buttonProgress: {
        color: theme.palette.secondary.light,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    },
}));

export default function CopyDialog(props) {
    const { t } = useTranslation();
    const [selectedPath, setSelectedPath] = useState("");
    const [selectedPathName, setSelectedPathName] = useState("");

    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch],
    );
    const SetModalsLoading = useCallback(
        (status) => {
            dispatch(setModalsLoading(status));
        },
        [dispatch],
    );
    const RefreshFileList = useCallback(() => {
        dispatch(refreshFileList());
    }, [dispatch]);

    const setMoveTarget = (folder) => {
        const path =
            folder.path === "/"
                ? folder.path + folder.name
                : folder.path + "/" + folder.name;
        setSelectedPath(path);
        setSelectedPathName(folder.name);
    };

    const submitMove = (e) => {
        if (e != null) {
            e.preventDefault();
        }
        SetModalsLoading(true);
        const dirs = [],
            items = [];
        // eslint-disable-next-line

        if (props.selected[0].type === "dir") {
            dirs.push(props.selected[0].id);
        } else {
            items.push(props.selected[0].id);
        }

        API.post("/object/copy", {
            src_dir: props.selected[0].path,
            src: {
                dirs: dirs,
                items: items,
            },
            dst: selectedPath === "//" ? "/" : selectedPath,
        })
            .then(() => {
                props.onClose();
                RefreshFileList();
                SetModalsLoading(false);
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
                SetModalsLoading(false);
            });
    };

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">
                {t("fileManager.copyTo")}
            </DialogTitle>
            <PathSelector
                presentPath={props.presentPath}
                selected={props.selected}
                onSelect={setMoveTarget}
            />

            {selectedPath !== "" && (
                <DialogContent className={classes.contentFix}>
                    <DialogContentText>
                        <Trans
                            i18nKey={"fileManager.copyToDst"}
                            values={{
                                dst: selectedPathName,
                            }}
                            components={[<strong key={0} />]}
                        />
                    </DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={props.onClose}>
                    {t("cancel", { ns: "common" })}
                </Button>
                <div className={classes.wrapper}>
                    <Button
                        onClick={submitMove}
                        color="primary"
                        disabled={selectedPath === "" || props.modalsLoading}
                    >
                        {t("ok", { ns: "common" })}
                        {props.modalsLoading && (
                            <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                            />
                        )}
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
