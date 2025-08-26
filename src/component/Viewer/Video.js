import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Button, Paper } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useLocation, useParams, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import pathHelper from "../../utils/page";
import UseFileSubTitle from "../../hooks/fileSubtitle";
import { getPreviewURL } from "../../middleware/Api";
import { useHistory } from "react-router-dom";
import { basename, fileNameNoExt, isMobileSafari } from "../../utils";
import { list } from "../../services/navigate";
import { getViewerURL } from "../../redux/explorer/action";
import { subtitleSuffix, videoPreviewSuffix } from "../../config";
import { toggleSnackbar } from "../../redux/explorer";
import { pathJoin } from "../Uploader/core/utils";
import { Launch, PlaylistPlay, Subtitles } from "@material-ui/icons";
import TextLoading from "../Placeholder/TextLoading";
import SelectMenu from "./SelectMenu";
import { getDownloadURL } from "../../services/file";
import { sortMethodFuncs } from "../FileManager/Sort";
import { useTranslation } from "react-i18next";
import { baseURL } from "../../middleware/Api";
import TypeIcon from "./../FileManager/TypeIcon";

const Artplayer = React.lazy(
    () =>
        import(
            /* webpackChunkName: "artplayer" */ "artplayer/examples/react/Artplayer"
        ),
);

const externalPlayers = [
    {
        name: "PotPlayer",
        url: (source, title) => `potplayer://${source}`,
    },
    {
        name: "VLC",
        url: (source, title) => `vlc://${source}`,
    },
    {
        name: "IINA",
        url: (source, title) => `iina://weblink?url=${source}`,
    },
    {
        name: "nPlayer",
        url: (source, title) => `nplayer-${source}`,
    },
    {
        name: "MXPlayer (Free)",
        url: (source, title) =>
            `intent:${source}#Intent;package=com.mxtech.videoplayer.ad;S.title=${title};end`,
    },
    {
        name: "MXPlayer (Pro)",
        url: (source, title) =>
            `intent:${source}#Intent;package=com.mxtech.videoplayer.pro;S.title=${title};end`,
    },
];

const useStyles = makeStyles((theme) => ({
    layout: {
        width: "auto",
        marginTop: 30,
        marginBottom: 20,
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
            width: 1100,
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    player: {
        height: "100vh",
        maxHeight: "calc(100vh - 180px)",
    },
    actions: {
        marginTop: theme.spacing(2),
    },
    actionButton: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    "@global": {
        "video,.art-video-player,.art-bottom": {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function VideoViewer() {
    const { t } = useTranslation();
    const math = useRouteMatch();
    const location = useLocation();
    const query = useQuery();
    const { id } = useParams();
    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch],
    );
    const { title, path } = UseFileSubTitle(query, math, location);
    const theme = useTheme();
    const [art, setArt] = useState(null);
    const history = useHistory();
    const [files, setFiles] = useState([]);
    const [subtitles, setSubtitles] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [subtitleOpen, setSubtitleOpen] = useState(null);
    const [subtitleSelected, setSubtitleSelected] = useState("");
    const [playlistOpen, setPlaylistOpen] = useState(null);
    const [externalPlayerOpen, setExternalPlayerOpen] = useState(null);
    const isShare = pathHelper.isSharePage(location.pathname);
    const sortMethod = useSelector((state) => state.viewUpdate.sortMethod);
    const sortFunc = sortMethodFuncs[sortMethod];

    const pageSize = 10;
    const [selectedIndex, setSelectedIndex] = useState(
        playlist.findIndex((obj) => obj.name === title),
    );
    const [totalPage, setTotalPage] = useState(
        Math.floor(playlist.length / pageSize) + 1,
    );
    const [page, setPage] = useState(Math.floor(selectedIndex / pageSize) + 1);
    const [pageArray, setPageArray] = useState([]);

    useEffect(() => {
        setSelectedIndex(playlist.findIndex((obj) => obj.name === title));
        setTotalPage(Math.floor(playlist.length / pageSize) + 1);
    }, [playlist, title]);

    useEffect(() => {
        setPage(Math.floor(selectedIndex / pageSize) + 1);
    }, [selectedIndex]);

    useEffect(() => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPageArray(playlist.slice(startIndex, endIndex));
    }, [page]); // 依赖数组：当 page 或 playlist 变化时触发

    const imageStyle = {
        width: "150px", // 固定图片宽度
        height: "auto", // 自动调整高度
        borderRadius: "8px", // 圆角
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 图片阴影
    };

    const detailsStyle = {
        flex: 1, // 右侧内容占据剩余空间
    };

    useEffect(() => {
        art &&
            art.on("ready", () => {
                art.autoHeight = true;
            });
        return () => {
            if (
                art !== null &&
                !isMobileSafari() &&
                document.pictureInPictureEnabled &&
                art.playing
            ) {
                art.pip = true;
                art.query(".art-video").addEventListener(
                    "leavepictureinpicture",
                    () => {
                        art.pause();
                    },
                    false,
                );
            }
        };
    }, [art]);

    const classes = useStyles();

    useEffect(() => {
        if (art !== null) {
            const newURL = getPreviewURL(
                isShare,
                id,
                query.get("id"),
                query.get("share_path"),
            );
            if (newURL !== art.url) {
                if (art.subtitle) {
                    art.subtitle.show = false;
                }
                art.switchUrl(newURL);
                if (path && path !== "") {
                    list(
                        basename(path),
                        isShare ? { key: id } : null,
                        "",
                        "",
                    ).then((res) => {
                        setFiles(
                            res.data.objects
                                .sort(sortFunc)
                                .filter((o) => o.type === "file"),
                        );
                        setPlaylist(
                            res.data.objects.filter(
                                (o) =>
                                    o.type === "file" &&
                                    videoPreviewSuffix.indexOf(
                                        o.name.split(".").pop().toLowerCase(),
                                    ) !== -1,
                            ),
                        );
                    });
                }
            }
        }
    }, [art, id, location, path]);

    const switchSubtitle = (f) => {
        if (art !== null) {
            const fileType = f.name.split(".").pop().toLowerCase();
            art.subtitle.switch(
                getPreviewURL(
                    isShare,
                    id,
                    f.id,
                    pathJoin([basename(query.get("share_path")), f.name]),
                ),
                {
                    type: fileType,
                },
            );
            art.subtitle.show = true;
            setSubtitleSelected(f.name);
            ToggleSnackbar(
                "top",
                "center",
                t("fileManager.subtitleSwitchTo", {
                    subtitle: f.name,
                }),
                "info",
            );
        }
    };

    useEffect(() => {
        if (files.length > 0) {
            const fileNameMatch = fileNameNoExt(title) + ".";
            const options = files
                .filter((f) => {
                    const fileType = f.name.split(".").pop().toLowerCase();
                    return subtitleSuffix.indexOf(fileType) !== -1;
                })
                .sort((a, b) => {
                    return a.name.startsWith(fileNameMatch) &&
                        !b.name.startsWith(fileNameMatch)
                        ? -1
                        : 0;
                });
            if (
                options.length > 0 &&
                options[0].name.startsWith(fileNameMatch)
            ) {
                switchSubtitle(options[0]);
            }
            setSubtitles(options);
        }
    }, [files]);

    const switchVideo = (file) => {
        setSubtitleSelected(null);
        if (isShare) {
            file.key = id;
        }
        if (isMobileSafari()) {
            window.location.href = getViewerURL("video", file, isShare);
        } else {
            history.push(getViewerURL("video", file, isShare));
        }
    };

    const setSubtitle = (sub) => {
        setSubtitleOpen(null);
        switchSubtitle(sub);
    };

    const startSelectSubTitle = (e) => {
        if (subtitles.length === 0) {
            ToggleSnackbar(
                "top",
                "right",
                t("fileManager.noSubtitleAvailable"),
                "warning",
            );
            return;
        }
        setSubtitleOpen(e.currentTarget);
    };

    const openInExternalPlayer = (player) => {
        const current = { name: title };
        current.id = query.get("id");
        current.path = basename(path);
        if (isShare) {
            current.key = id;
        }

        setExternalPlayerOpen(null);
        getDownloadURL(current)
            .then((response) => {
                window.location.assign(player.url(response.data, title));
            })
            .catch((error) => {
                ToggleSnackbar("top", "right", error.message, "error");
            });
    };

    const gotoPreVideo = () => {
        const index = playlist.findIndex((obj) => obj.name === title);
        if (index <= 0) {
            ToggleSnackbar("top", "center", `前面没有更多了`, "info");
            return;
        }
        switchVideo(playlist[index - 1]);
    };
    const gotoNextVideo = () => {
        const index = playlist.findIndex((obj) => obj.name === title);
        if (index >= playlist.length - 1) {
            ToggleSnackbar("top", "center", `后面没有更多了`, "info");
            return;
        }
        switchVideo(playlist[index + 1]);
    };

    const nextPage = () => {
        if (page < totalPage) {
            setPage(page + 1);
        }
    };

    const prePage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const jumpTo = (item) => {
        const index = playlist.findIndex((obj) => obj.name === item.name);
        switchVideo(playlist[index]);
    };

    return (
        <div className={classes.layout}>
            <Paper className={classes.root} elevation={1}>
                <Suspense fallback={<TextLoading />}>
                    <Artplayer
                        option={{
                            title: title,
                            theme: theme.palette.secondary.main,
                            flip: true,
                            setting: true,
                            playbackRate: true,
                            aspectRatio: true,
                            hotkey: true,
                            pip: true,
                            fullscreen: true,
                            fullscreenWeb: true,
                            autoHeight: true,
                            whitelist: ["*"],
                            moreVideoAttr: {
                                "webkit-playsinline": true,
                                playsInline: true,
                            },
                            lang: t("artPlayerLocaleCode", { ns: "common" }),
                        }}
                        className={classes.player}
                        getInstance={(a) => setArt(a)}
                    />
                </Suspense>
            </Paper>
            <div className={classes.actions}>
                <Button
                    onClick={startSelectSubTitle}
                    className={classes.actionButton}
                    startIcon={<Subtitles />}
                    variant="outlined"
                >
                    {t("fileManager.subtitle")}
                </Button>
                {playlist.length >= 2 && (
                    <Button
                        onClick={(e) => setPlaylistOpen(e.currentTarget)}
                        className={classes.actionButton}
                        startIcon={<PlaylistPlay />}
                        variant="outlined"
                    >
                        {t("fileManager.playlist")}
                    </Button>
                )}
                <Button
                    onClick={(e) => setExternalPlayerOpen(e.currentTarget)}
                    className={classes.actionButton}
                    startIcon={<Launch />}
                    variant="outlined"
                >
                    {t("fileManager.openInExternalPlayer")}
                </Button>
                <Button
                    className={classes.actionButton}
                    onClick={() => {
                        gotoPreVideo();
                    }}
                    variant="outlined"
                >
                    上一个
                </Button>
                <Button
                    className={classes.actionButton}
                    onClick={() => {
                        gotoNextVideo();
                    }}
                    variant="outlined"
                >
                    下一个
                </Button>
            </div>
            <SelectMenu
                selected={subtitleSelected}
                options={subtitles}
                callback={setSubtitle}
                anchorEl={subtitleOpen}
                handleClose={() => setSubtitleOpen(null)}
            />
            <SelectMenu
                selected={title}
                options={playlist}
                callback={switchVideo}
                anchorEl={playlistOpen}
                handleClose={() => setPlaylistOpen(null)}
            />
            <SelectMenu
                showIcon={false}
                options={externalPlayers}
                callback={openInExternalPlayer}
                anchorEl={externalPlayerOpen}
                handleClose={() => setExternalPlayerOpen(null)}
            />
            <div
                style={{
                    width: "70%",
                    border: "1px solid #000",
                    borderRadius: "5px",
                    margin: "4px auto",
                }}
            >
                <Button
                    className={classes.actionButton}
                    onClick={() => {
                        prePage();
                    }}
                    variant="outlined"
                >
                    上一页
                </Button>
                <Button
                    className={classes.actionButton}
                    onClick={() => {
                        nextPage();
                    }}
                    variant="outlined"
                >
                    下一页
                </Button>
                <Button className={classes.actionButton} variant="outlined">
                    {page}/{totalPage}页
                </Button>

                <div style={{ overflowY: "auto", height: 512 }}>
                    {pageArray.map((item) => (
                        <div
                            onClick={() => {
                                if (item.name === title) {
                                    return;
                                }
                                jumpTo(item);
                            }}
                            style={{
                                display: "flex", // 使用 flexbox 布局
                                alignItems: "flex-start", // 左对齐
                                gap: "20px", // 左右间距
                                padding: "8px", // 内边距
                                border:
                                    item.name === title
                                        ? "1px solid red"
                                        : "1px solid #ddd", // 边框
                                borderRadius: "8px", // 圆角
                                maxWidth: "600px", // 最大宽度
                                margin: "20px auto", // 居中
                                backgroundColor: "#f9f9f9", // 背景色
                                cursor: "pointer",
                            }}
                            key={item.id}
                        >
                            {/* 左边图片 */}
                            <div>
                                {item.thumb && (
                                    <div className={classes.preview}>
                                        <img
                                            src={
                                                baseURL +
                                                "/file/thumb/" +
                                                item.id
                                            }
                                            style={imageStyle}
                                        />
                                    </div>
                                )}
                                {!item.thumb && (
                                    <div className={classes.previewIcon}>
                                        <TypeIcon
                                            className={classes.iconBig}
                                            fileName={item.name}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* 右边详细信息 */}
                            <div style={detailsStyle}>
                                <h4>{item.name}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
