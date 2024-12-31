import React, { useCallback, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "@material-ui/lab";
import CustomPaginationItem from "./PaginationItem";
import { setPagination } from "../../redux/viewUpdate/action";
import AutoHidden from "../Dial/AutoHidden";
import statusHelper from "../../utils/page";
import { useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { toggleSnackbar } from "../../redux/explorer";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        bottom: 23,
        /* left: 8px; */
        background: theme.palette.background.paper,
        borderRadius: 24,
        boxShadow:
            " 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)",
        padding: "8px 4px 8px 4px",
        marginLeft: 20,
    },
    placeholder: {
        marginTop: 80,
    },
}));

export default function PaginationFooter() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const files = useSelector((state) => state.explorer.fileList);
    const folders = useSelector((state) => state.explorer.dirList);
    const pagination = useSelector((state) => state.viewUpdate.pagination);
    const loading = useSelector((state) => state.viewUpdate.navigatorLoading);
    const location = useLocation();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch],
    );

    const SetPagination = useCallback(
        (p) => dispatch(setPagination(p)),
        [dispatch],
    );

    const handleChange = (event, value) => {
        SetPagination({ ...pagination, page: value });
    };

    const count = useMemo(
        () => Math.ceil((files.length + folders.length) / pagination.size),
        [files, folders, pagination.size],
    );

    const isMobile = statusHelper.isMobile();
    const isSharePage = statusHelper.isSharePage(location.pathname);
    // const keywords=pagination.page
    const [keywords, setKeywords] = useState(undefined);
    const jumpPage = () => {
        // console.log(count)
        if (!keywords) {
            ToggleSnackbar("top", "center", `what are you doing here!`, "info");
            return;
        }
        if (+keywords < 1) {
            ToggleSnackbar("top", "center", `what are you doing here!`, "info");
            return;
        }
        if (+keywords > count) {
            ToggleSnackbar("top", "center", `what are you doing here!`, "info");
            return;
        }
        if (+keywords === pagination.page) {
            ToggleSnackbar("top", "center", `You are alreadly here!`, "info");
            return;
        }
        handleChange(undefined, +keywords);
    };
    const jumpToFirst = () => {
        if (pagination.page === 1) {
            ToggleSnackbar("top", "center", `You are alreadly here!`, "info");
            return;
        }
        handleChange(undefined, 1);
    };
    const jumpToLast = () => {
        if (pagination.page === count) {
            ToggleSnackbar("top", "center", `You are alreadly here!`, "info");
            return;
        }
        handleChange(undefined, count);
    };

    if (count > 1 && !loading) {
        return (
            <>
                {!isMobile && !isSharePage && (
                    <div className={classes.placeholder} />
                )}
                <AutoHidden
                    enable
                    element={
                        isMobile || isSharePage
                            ? null
                            : document.querySelector("#explorer-container")
                    }
                >
                    <div className={classes.root}>
                        <Pagination
                            renderItem={(item) => (
                                <CustomPaginationItem
                                    count={count}
                                    isMobile={isMobile}
                                    {...item}
                                />
                            )}
                            color="secondary"
                            count={count}
                            page={pagination.page}
                            onChange={handleChange}
                        />
                        <Button onClick={jumpToFirst} color="default">
                            First
                        </Button>
                        <Button onClick={jumpToLast} color="default">
                            Last
                        </Button>
                        <Button onClick={jumpPage} color="default">
                            GoTo
                        </Button>
                        <TextField
                            style={{ width: "5rem" }}
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>
                </AutoHidden>
            </>
        );
    }
    return <div></div>;
}
