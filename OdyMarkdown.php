<?php
include_once('vendor/autoload.php');

use \cebe\markdown\latex\Markdown;

class OdyMarkdown extends Markdown
{
 	// Generic functions for command parsing
	private function identifyCommand($line, $command)
	{
		if (strncmp($line, '!' . $command, strlen($command) + 1) === 0)
		{
			return true;
		}
		return false;
	}

	private function consumeCommand($lines, $current, $command)
	{
		$block = [$command];
		$line = rtrim($lines[$current]);
		$start = strpos($line, '[', strlen($command) + 1) + 1;
		if($start !== false)
		{
			$stop = strpos($line, ']', $start);
			if($stop !== false)
			{
				$argumentString = substr($line, $start, $stop - $start);
				$next = $current + 1;
			}
			else
			{
				$argumentString = substr($line, $start);
				for($i = $current + 1; $i < count($lines); ++$i)
				{
					$stop = strpos($lines[$i], "]");
					if($stop !== false)
					{
						$argumentString .= substr($lines[$i], 0, $stop);
						$next = $i + 1;
						break;
					}
					else
					{
						$argumentString .= $lines[$i];
					}
				}
			}
		}
		$argumentString = str_replace(' ', '', $argumentString);
		$argumentArray = explode(',', $argumentString);
		foreach($argumentArray as $arg)
		{
			$keyval = explode('=', $arg);
			if(count($keyval) !== 2)
			{
				break;
			}
			$block[$keyval[0]] = $keyval[1];
		}
		return [$block, $next];
	}

	// Notes extension
	protected function identifyNotes($line, $lines, $current)
	{
		return $this->identifyCommand($line, 'notes');
	}

	protected function consumeNotes($lines, $current)
	{
		return $this->consumeCommand($lines, $current, 'notes');
	}

	protected function renderNotes($block)
	{
		if(isset($block['height']))
		{
			if($block["height"] === 'eop')
			{
				return "\\dottedpage\n";
			}
			else
			{
				return "\\dottedlines[" . $block['height'] . "]\n";
			}
		}
		else
		{
			return "\\dottedline\n";
		}
	}
}
?>
