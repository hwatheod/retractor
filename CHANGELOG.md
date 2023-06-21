v2.3.2

* Fixed a pawn capture evaluation bug. For one particular lower bound, forgot to check that the
pawn was on its promotion rank.

v2.3.1

* Report the time taken for solving.

v2.3

* Retractor can now count pawn captures coming from promoted pieces that are on the
board.

v2.2.3

* Fixed a bug where promoted rooks weren't detected properly when a cage 
took up the entire first rank.

v2.2.2

* "None" button is now available in edit mode to clear a square.

v2.2.1

* Solutions can now be exported (Issue #6)
* Maximum number of solutions bumped to 10000.

v2.2

New feature: Cages
* "Cage" feature added which allows users to specify a cage to be verified by Retractor.
If verification succeeds, Retractor uses this cage for future solving.
* Verified cages may be exported and imported.
* For more details and examples, see the "Cages" link in the software.
* For a more formal description of the cage verification algorithm, see [this document](https://github.com/hwatheod/retractor-python/blob/main/doc/cages.pdf). 

Other changes
* Minor fixes with illegal move detection and reporting when pasting a game.

v2.1.1
* For solving, add option to specify that White or Black or both sides cannot uncapture. (Issue #4)

v2.1

* Promoted rooks outside cages are now detected.
* Some illegal king positions behind enemy pawn cages are now detected (see help text for more details).

v2.0.1

* Copy buttons are now working. It displays a sequence of moves in a text box which you can then copy to the clipboard. (Issue #1)
* Solution limit increased to 100.
* Show warning message if the solution limit is reached.
* Minor help text changes.

v2.0.0

Initial release.