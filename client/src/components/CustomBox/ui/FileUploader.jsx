import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FileUploader.module.css';

export default function FileUploader({
  onUpload,
  currentFile,
  maxSize = 10485760,
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (accepted, rejected) => {
      if (accepted.length > 0) onUpload(accepted[0]);
      if (rejected.length > 0) alert('File rejected. Please upload PNG, JPG, PDF, AI, or EPS (max 10 MB).');
    },
    accept: {
      'image/png':              ['.png'],
      'image/jpeg':             ['.jpg', '.jpeg'],
      'application/pdf':        ['.pdf'],
      'application/postscript': ['.eps', '.ai'],
    },
    maxSize,
    maxFiles: 1,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`${styles.zone} ${isDragActive ? styles.dragActive : ''} ${isDragReject ? styles.dragReject : ''}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {currentFile ? (
          <motion.div
            key="uploaded"
            className={styles.fileUploaded}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.fileThumb}>
              {currentFile.type.startsWith('image') ? (
                <img src={URL.createObjectURL(currentFile)} alt="Preview" />
              ) : (
                <div className={styles.fileDocIcon}>📄</div>
              )}
            </div>
            <div className={styles.fileInfoBlock}>
              <p className={styles.fileName}>{currentFile.name}</p>
              <p className={styles.fileSize}>{(currentFile.size / 1024).toFixed(0)} KB</p>
              <span className={styles.fileSuccess}>✓ Uploaded</span>
              <p className={styles.fileHint}>Click or drag to replace</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.uploadIcon}
              animate={isDragActive ? { scale: 1.15 } : { scale: 1 }}
            >
              {isDragActive ? '⬇' : '📤'}
            </motion.div>
            <p className={styles.uploadTitle}>
              {isDragActive ? 'Release to upload' : 'Drag & drop your artwork'}
            </p>
            <p className={styles.uploadSub}>or click to browse files</p>
            <p className={styles.uploadFormats}>PNG, JPG, PDF, AI, EPS — max 10 MB</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
