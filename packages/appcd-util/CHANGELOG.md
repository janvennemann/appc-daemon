# v1.1.8

 * chore: Updated dependencies

# v1.1.7 (Jun 4, 2019)

 * chore: Updated dependencies.

# v1.1.6 (Mar 29, 2019)

 * chore: Updated dependencies.

# v1.1.5 (Jan 16, 2019)

 * fix: Updated `getActiveHandles()` to gracefully work in the event Node.js deprecates
   `process._getActiveHandles()`.
 * fix: Gracefully handle calls to `process.binding()` should Node.js deprecate it or any of the
   requested bindings.
 * fix: Added `trackTimers()` function in lieu of `getActiveHandles()` no longer being reliable for
   determining active timers in Node.js 11. `trackTimers()` uses async hooks which where added in
   Node.js 8.1.0.
   [(DAEMON-268)](https://jira.appcelerator.org/browse/DAEMON-268)
 * fix: `tailgate()` no longer forces asynchronous execution of the callback using
   `setImmediate()`.
 * refactor: Refactored promises to async/await.
 * chore: Updated dependencies.

# v1.1.4 (Nov 26, 2018)

 * chore: Updated dependencies.

# v1.1.3 (Nov 26, 2018)

 * chore: Updated dependencies.

# v1.1.2 (Sep 17, 2018)

 * feat: Added `osInfo()` function to get operating system name and version.
 * chore: Removed unused variables in tests.
 * chore: Updated dependencies.

# v1.1.1 (May 24, 2018)

 * chore: Updated dependencies.

# v1.1.0 (Apr 9, 2018)

 * feat: Added ability to cancel a pending `debounce()`.
   [(DAEMON-238)](https://jira.appcelerator.org/browse/DAEMON-238)
 * chore: Improved readme.
 * chore: Updated dependencies.

# v1.0.1 (Dec 15, 2017)

 * chore: Updated dependencies.

# v1.0.0 (Dec 5, 2017)

 - Initial release.
