<template>
    <div :class="['common-upload-wrapper', { iconType: type === 'icon' }]">
        <!-- 头像 1.avatar,2.value-->

        <div class="avatar" v-if="avatar">
            <img
                class="img"
                :src="initImg()"
                onerror="this.src='static/img/defaultAvatar.jpg'"
                title="点击下载"
                alt=""
            />
        </div>
        <!-- 单文件1.fileName,2.value -->
        <div class="file file-list" v-if="fileName && hideFile && showFileList">
            <!-- {{initImg()}} -->
            <div class="operate">
                <span v-if="isReview" title="预览" @click="showView()"
                    ><i class="iconfont icon-yulan"></i
                ></span>
                <span v-if="isOnRemove" title="删除" @click="removeSingleFile()"
                    ><i class="iconfont icon-close"></i
                ></span>
            </div>
            <img
                v-if="isImage"
                :src="showImg ? initImg() : imageUrl"
                onerror="this.src='static/img/defaultAvatar.jpg'"
                title="点击下载"
                alt=""
                @click="downLoad()"
            />
            <svg
                v-else
                class="svgicon"
                aria-hidden="true"
                title="点击下载"
                @click="downLoad()"
            >
                <use :xlink:href="[`#` + getFileType(fileName)]"></use>
            </svg>
            <div v-if="showFileTitle" class="singerName" :title="fileName">
                {{ fileName }}
            </div>
        </div>
        <div v-if="fileName === undefined && !avatar && showFileList">
            <!-- 多文件 1.value-->
            <div
                :class="['file-list']"
                v-for="(file, index) in fileList"
                :key="index"
            >
                <div class="operate">
                    <a target="_blank" title="下载" :href="getDownloadUrl(file)"
                        ><span><i class="iconfont el-icon-download"></i></span
                    ></a>
                    <span title="删除" @click="removeFile(file, index)"
                        ><i class="iconfont icon-close"></i
                    ></span>
                </div>
                <div class="preview">
                    <img
                        :src="file.url"
                        onerror="this.src='static/img/defaultAvatar.jpg'"
                        title="点击下载"
                        alt=""
                        @click="downLoad()"
                    />
                    <svg class="svgicon" aria-hidden="true">
                        <use :xlink:href="[`#` + getFileType(file.name)]"></use>
                    </svg>
                </div>
                <div class="name">{{ file.name }}</div>
            </div>
        </div>
        <el-upload
            class="uploadFile"
            ref="upload"
            :action="dataUrl"
            :name="name"
            :data="uploadData"
            :limit="limit"
            :multiple="multiple"
            :list-type="showType"
            :drag="type === 'drag'"
            :auto-upload="autoUpload"
            :show-file-list="showFile"
            :file-list="fileList"
            :before-upload="onBeforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :on-exceed="onExceed"
            :on-remove="onRemove"
            :on-preview="onPreview"
            :on-change="onChange"
            :accept="acceptType"
        >
            <i
                v-if="type === 'icon'"
                class="iconType el-icon-plus avatar-uploader-icon"
            ></i>
            <el-button v-if="type === 'text'" type="text underline primary">{{
                text
            }}</el-button>
            <el-button v-if="type === 'button'" type="primary">{{
                text
            }}</el-button>
            <span class="el-upload__tip" style="color: red"
                >禁止上传涉密信息!</span
            >
            <!-- <span v-if="avatar&&!hideTip" style="color: red;position: absolute;top: -6px;right: 225px;">禁止上传涉密信息!</span> -->
            <div v-if="type === 'drag'" class="drag">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或<em>{{ text }}</em>
                </div>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "commonUpload",
    components: {},
    props: {
        //list-type=picture,picture-card,text
        text: {
            type: String,
            default: "点击上传",
        }, //url
        url: String, //url
        value: [String, Array], //数据
        data: Object, //额外参数
        name: {
            //请求key
            type: String,
            default: "photo",
        },
        type: {
            //显示类型1.button,2.icon,3.text,4.drag
            type: String,
            default: "button",
        },
        showType: {
            //文件列表展示类型1.text,2.picture,3.picture-card
            type: String,
            default: "text",
        },
        showFileList: {
            //是否上传头像
            type: Boolean,
            default: true,
        },
        avatar: {
            //是否上传头像
            type: Boolean,
            default: false,
        },
        autoUpload: {
            //是否自动上传
            type: Boolean,
            default: true,
        },
        downLoadFile: {
            // 下载文件传到外面执行
            type: Boolean,
            default: false,
        },
        isReview: {
            //是否显示预览选项
            type: Boolean,
            default: false,
        },
        reviewFile: {
            // 预览文件传到外面执行
            type: Boolean,
            default: false,
        },
        limit: {
            //允许最大上传数
            type: Number,
            default: 10,
        },
        multiple: {
            //是否支持多选文件
            type: Boolean,
            default: false,
        },
        showFile: {
            //是否显示上传文件列表
            type: Boolean,
            default: false,
        },
        viewImg: {
            //新疆多个upload显示文件地址后面要拼接name,例如A135信息集
            type: Boolean,
            default: false,
        },
        //是否删除
        isOnRemove: {
            type: Boolean,
            default: false,
        },
        fileName: String, //文件名
        accept: String, //接受上传的文件类型
        loadImg: Function, //图片处理外部
        hideTip: Boolean,
    },
    data() {
        return {
            imageUrl: "",
            dialogImageUrl: "",
            formatX: this.$moment().format("x"),
            dialogVisible: false,
            otherData: null,
            fileData: [],
            showImg: true,
            fileType: [
                { key: "jpeg", value: "image/jpeg" },
                { key: "jpg", value: "image/jpeg" },
                { key: "gif", value: "image/jpeg" },
                { key: "png", value: "image/png" },
                { key: "doc", value: "application/msword" },
                {
                    key: "docx",
                    value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                },
                { key: "xls", value: "application/vnd.ms-excel" },
                {
                    key: "xlsx",
                    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
                { key: "pdf", value: "application/pdf" },
                { key: "txt", value: "text/plain" },
                { key: "zip", value: "application/zip" },
                { key: "rar", value: "application/x-rar-compressed" },
                { key: "lrmx", value: "" },
            ],
            hideFile: true,
            // showViewFile: this.$dataFields.showViewFile,             // 信息集多媒体文件预览
            // showViewFile: false,             // 信息集多媒体文件预览
            showFileTitle: this.$dataFields.showFileTitle,
            selectFileList: [],
            uploadFileNum: 0,
            successFileNum: 0,
            errorFileNum: 0,
            uploadErrorReason: "",
        };
    },
    watch: {
        value(val) {
            this.hideFile = true;
            this.showImg = true;
        },
    },
    computed: {
        acceptType() {
            let str = ""
            if(this.accept) {
                this.accept.split(",").forEach((item) => {
                    item = "." + item + ","
                    str += item
                })
            }
            return str
        },
        // showRemove() {
        //     return this.$dataFields.showFileRemove
        // },
        //上传url
        dataUrl() {
            // return 'https://jsonplaceholder.typicode.com/posts/';
            if (this.url) return this.$baseUrl + this.url;
            return `${this.$baseUrl}cadre/uploadPhoto?empId=${this.value}`;
        },
        //上传的额外数据
        uploadData() {
            if (this.data) return this.data;
            return this.otherData;
        },
        //数据列表
        fileList: {
            get() {
                if (this.fileData && this.fileData.length > 0)
                    return this.fileData;
                if (this.avatar || this.fileName !== undefined) return [];
                return this.value ? this.value : [];
            },
            set(val) {
                if (this.fileName !== undefined) {
                    this.$emit("update:fileName", val[0].name);
                } else if (!this.avatar) this.$emit("input", val);
            },
        },
        //是fileName的时候，文件类型
        isImage() {
            let fileType = this.getFileType(this.fileName);
            if (fileType === "icon-PNG") return true;
            return false;
        },

        //头像时初始化照片
        initImg() {
            let times = this.$moment().format("x");
            if (this.loadImg) return this.loadImg();
            if (this.avatar)
                return `${this.$baseUrl}cadre/photo?empId=${this.value}`;
            if (this.fileName) {
                if (this.viewImg) {
                    return `${this.$baseUrl}cadre/media/${this.value}_${this.name}?${times}`;
                } else {
                    return `${this.$baseUrl}cadre/media/${this.value}`;
                }
            }

            this.showImg = false;
            return this.imageUrl ? this.imageUrl : "aaa";
        },
    },
    created() {},
    methods: {
        //进行中组部格式文件上传时，判断是否是选择的最后一条数据
        isSelectLastFile(file, fileList) {
            if (
                file &&
                fileList.length > 0 &&
                this.uploadFileNum == fileList.length
            ) {
                console.log(this.uploadFileNum);
                return true;
            }
            return false;
        },
        //改变文件list
        onChange(file, fileList) {
            this.hideFile = true;
            if (this.avatar || this.fileName !== undefined)
                this.fileData = [file];
            else this.fileData = fileList;
            this.imageUrl = URL.createObjectURL(file.raw);
            this.showImg = false;
            this.$emit("update:fileName", file.name);
            this.$emit("change", this.name, file, fileList);
        },
        //删除文件
        onRemove(file, fileList) {
            this.$emit("handlerRemove", file, fileList);
            console.log(file, fileList);
        },
        //预览文件
        onPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //上传成功回调
        onSuccess(res, file) {
            this.uploadFileNum++;
            // this.$refs.upload.getFile(this.name)
            let nameFile = this.$refs.upload.getFile(this.name);
            this.$store.commit(
                "updatePageLoading",
                --this.$store.state.pageLoading
            );
            if (this.avatar || this.fileName) this.clearFile();
            if (res.code === 200) {
                this.successFileNum++;
                this.formatX = this.$moment().format("x");
                this.imageUrl = URL.createObjectURL(file.raw);
                this.showImg = false;
                //批量多选上传时不单独打印提示信息，待所有文件上传后重新发交易获取结果数据
                //this.$showMsg("success", "上传成功");
                this.$emit("update:fileName", file.name);
                this.$emit("success", res, file, this.imageUrl);
            } else {
                this.errorFileNum++;
                if (res.message) {
                    this.uploadErrorReason += "，" + res.message;
                }
            }

            if (
                this.name == "multipartFile" &&
                this.isSelectLastFile(file, this.selectFileList)
            ) {
                let resultMessage =
                    "共导入" +
                    this.uploadFileNum +
                    "条数据，导入成功" +
                    this.successFileNum +
                    "条，失败" +
                    this.errorFileNum +
                    "条";
                //重新刷新数据
                this.$emit(
                    "onRefresh",
                    resultMessage,
                    this.uploadErrorReason.substring(1)
                );
                this.selectFileList = [];
                this.uploadFileNum = 0;
                this.successFileNum = 0;
                this.errorFileNum = 0;
                this.uploadErrorReason = "";
                this.clearFile();
            }
        },
        //上传失败回调
        onError(err, file, fileList) {
            this.uploadFileNum++;
            this.errorFileNum++;
            this.uploadErrorReason += "，" + file.name + "文件上传失败";
            this.imageUrl = null;
            this.showImg = true;
            //批量多选上传时不单独打印提示信息，待所有文件上传后重新发交易获取结果数据
            // this.$message.error('上传失败，请稍后再试！')
            this.$store.commit(
                "updatePageLoading",
                --this.$store.state.pageLoading
            );
            if (
                this.name == "multipartFile" &&
                this.isSelectLastFile(file, this.selectFileList)
            ) {
                let resultMessage =
                    "共导入" +
                    this.uploadFileNum +
                    "条数据，导入成功" +
                    this.successFileNum +
                    "条，失败" +
                    this.errorFileNum +
                    "条";
                //重新刷新数据
                this.$emit(
                    "onRefresh",
                    resultMessage,
                    this.uploadErrorReason.substring(1)
                );
                this.selectFileList = [];
                this.uploadFileNum = 0;
                this.successFileNum = 0;
                this.errorFileNum = 0;
                this.uploadErrorReason = "";
                this.clearFile();
            }
        },
        //文件个数限制回调
        onExceed(files, fileList) {
            this.$showMsg(
                "warning",
                `当前限制选择 ${this.limit} 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        //清除文件
        clearFile() {
            console.log("清除文件");
            this.$refs.upload.clearFiles();
        },
        //头像时初始化照片
       /* initImg() {
            let times = this.$moment().format("x");
            if (this.loadImg) return this.loadImg() + `&code=${this.formatX}`;
            if (this.avatar)
                return `${this.$baseUrl}cadre/photo?empId=${this.value}&code=${this.formatX}`;
            if (this.fileName) {
                if (this.viewImg) {
                    return `${this.$baseUrl}cadre/media/${this.value}_${this.name}?${times}`;
                } else {
                    return `${this.$baseUrl}cadre/media/${this.value}`;
                }
            }

            this.showImg = false;
            return this.imageUrl ? this.imageUrl : "aaa";
        },*/
        //删除文件
        removeFile(file, index) {
            this.$showConfirm("确定删除该文件？", () => {
                this.fileList.splice(index, 1);
                this.$emit("update:fileName", "");
                this.$emit("onRemove", file, index);
            });
        },
        // 预览文件（新疆）
        showView() {
            let downLoadUrl = "";
            if (this.reviewFile) {
                // this.$emit('downLoad')
                let id = this.value;
                this.$emit("reviewFile", id);
            } else {
                if (this.fileName) {
                    if (this.viewImg) {
                        downLoadUrl =
                            this.$baseUrl +
                            `cadre/download/media?subjectId=${this.value}_${this.name}`;
                    } else {
                        downLoadUrl =
                            this.$baseUrl +
                            `cadre/download/media?subjectId=${this.value}`;
                    }
                } else {
                    downLoadUrl =
                        this.$baseUrl +
                        `cadre/photo?empId=${this.value}&code=${this.formatX}`;
                }
                window.open(downLoadUrl);
            }
        },
        // 单文件删除
        removeSingleFile() {
            // this.fileName = null
            this.$showConfirm("确定删除该文件？", () => {
                this.hideFile = false;
                this.$emit("update:fileName", "");
                this.$emit("change", this.name, {}, []);
                this.$emit("changeRule", this.name);
                console.log(this.fileList);
            });
        },
        downLoad() {
            let downLoadUrl = "";
            console.log(this.viewImg);
            if (this.downLoadFile) {
                // this.$emit('downLoad')
                let id = this.value;
                this.$emit("downLoadReview", id);
            } else {
                if (this.fileName) {
                    if (this.viewImg) {
                        downLoadUrl =
                            this.$baseUrl +
                            `cadre/download/media?subjectId=${this.value}_${this.name}`;
                    } else {
                        downLoadUrl =
                            this.$baseUrl +
                            `cadre/download/media?subjectId=${this.value}`;
                    }
                } else {
                    downLoadUrl =
                        this.$baseUrl +
                        `cadre/photo?empId=${this.value}&code=${this.formatX}`;
                }
                window.location.href = downLoadUrl;
            }
        },
        //下载文件url
        getDownloadUrl(file) {
            let url = `${this.$baseUrl}${this.downloadUrl}?fileName=${file.fileName}&pathName=${file.filePath}`;
            return encodeURI(url);
        },
        //获取文件类型
        getFileType(fileName) {
            let fileType = fileName
                ? fileName.substr(fileName.lastIndexOf(".") + 1)
                : "";
            switch (fileType) {
                case "docx":
                case "doc":
                    return "icon-DOC";
                    break;
                case "xls":
                    return "icon-XLS";
                    break;
                case "xlsx":
                    return "icon-XLS";
                    break;
                case "pdf":
                    return "icon-PDF";
                    break;
                case "txt":
                    return "icon-TXT";
                    break;
                case "zip":
                    return "icon-ZIP";
                    break;
                case "rar":
                    return "icon-RAR";
                    break;
                case "png":
                case "jpeg":
                case "jpg":
                case "bmp":
                case "gif":
                    return "icon-PNG";
                    break;
                case "lrmx":
                    return "icon-Lrmx";
                    break;
                default:
                    return "icon-wenjian1";
                    break;
            }
        },
        onBeforeUpload(file) {
            this.selectFileList.push(file);
            this.$store.commit(
                "updatePageLoading",
                ++this.$store.state.pageLoading
            );
            let accept = this.accept;
            let isMatching = false,
                msg = "";
            if (accept) {
                accept.split(",").forEach((item) => {
                    switch (item) {
                        case "jpg":
                        case "jpeg":
                        case "gif":
                        case "png":
                            msg = "图片;";
                            break;
                        case "xls":
                            msg += "xls;";
                            break;
                        case "xlsx":
                            msg += "xlsx;";
                            break;
                        case "doc":
                            msg += "doc;";
                            break;
                        case "docx":
                            msg += "docx;";
                            break;
                        case "pdf":
                            msg += "pdf;";
                            break;
                        case "txt":
                            msg += "txt;";
                            break;
                        case "zip":
                            msg += "zip;";
                            break;
                        case "rar":
                            msg += "rar;";
                            break;
                        case "lrmx":
                            msg += "lrmx;";
                            break;
                        default:
                            break;
                    }
                    this.fileType.forEach((type) => {
                        if (type.key === item) {
                            if (type.value === file.type) {
                                isMatching = true;
                            }
                        }
                    });
                });
                if (!isMatching) {
                    this.$message.warning(
                        "上传文件只能是" +
                            msg.substr(0, msg.length - 1) +
                            "格式!"
                    );
                    this.$store.commit(
                        "updatePageLoading",
                        --this.$store.state.pageLoading
                    );
                }
            } else {
                isMatching = true;
            }
            return isMatching;
        },
    },
};
</script>
<style lang="scss" type="text/scss">
$width: 135px;
$gap: 10px;
.common-upload-wrapper {
    position: relative;

    .file,
    .avatar {
        width: $width;
        height: $width;
        border-radius: 6px;
        border: 1px dashed #aaa;
        background: radial-gradient(#fff, #f5f5f5);
        margin-bottom: $gap;

        img,
        svg {
            width: $width;
            height: $width;
            cursor: pointer;
        }

        margin-right: $gap;
    }

    &.iconType {
        display: flex;
        flex-wrap: wrap;

        .el-upload {
            width: $width;
            height: $width;
            align-items: center;
            display: flex;
            justify-content: center;
            border: 1px dashed #aaa;
            border-radius: 6px;
            font-size: 28px;
            color: #8c939d;
            background-color: #fbfdff;
        }
    }

    .singerName {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        padding: 0 5px;
        background-color: #333333;
        opacity: 0.3;
        color: #fff;
        max-height: 24px;
        overflow: hidden;
    }

    .uploadFile {
        .el-upload--picture-card {
            width: $width;
            height: $width;
            line-height: $width;
        }

        .el-upload-list__item {
            width: $width;
            height: $width;
        }
    }

    .file-list {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-right: $gap;
        width: $width;
        height: $width;
        border-radius: 6px;
        border: 1px dashed rgba(232, 232, 232, 1);
        background: radial-gradient(#fff, #f5f5f5);

        .operate {
            position: absolute;
            width: 100%;
            top: 0px;
            text-align: right;
            // padding:  5px 5px 0;
            span {
                background-color: #333333;
                opacity: 0.3;
                display: inline-block;
                width: 18px;
                height: 18px;
                border-radius: 8px;
                text-align: center;
                line-height: 16px;
                cursor: pointer;

                i {
                    color: #fff;
                    font-size: 12px;
                }
            }
        }

        .preview {
            margin: 0 auto;

            svg,
            img {
                display: inline-block;
                width: 50px;
                height: 50px;
                box-sizing: border-box;
            }
        }

        .name {
            padding: 0 5px;
            background-color: #333333;
            opacity: 0.3;
            color: #fff;
            max-height: 24px;
            overflow: hidden;
        }
    }
}
</style>
