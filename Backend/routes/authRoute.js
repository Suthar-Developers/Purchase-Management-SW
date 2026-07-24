const router=require('express').Router(); const auth=require('../controller/authController'); const authenticate=require('../middleware/authenticate'); const {csrfProtection,issueCsrfToken}=require('../middleware/csrf');
router.get('/auth/csrf',issueCsrfToken); router.post('/auth/login',csrfProtection,auth.login); router.post('/auth/refresh',csrfProtection,auth.refresh); router.post('/auth/logout',csrfProtection,auth.logout); router.post('/auth/logout-all',authenticate,csrfProtection,auth.logoutAll); router.get('/me',authenticate,auth.me);
// temporary compatibility paths
router.post('/login',csrfProtection,auth.login); router.post('/refresh',csrfProtection,auth.refresh); router.post('/logout',csrfProtection,auth.logout);
module.exports=router;
